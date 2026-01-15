import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../shared/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, phone, password, passwordConfirm, name } = registerDto;

    // 验证密码确认
    if (password !== passwordConfirm) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    // 规范化手机号：去除空格，如果是空字符串或只包含空格则设为 undefined
    const normalizedPhone = phone && phone.trim() ? phone.trim() : undefined;

    // 检查邮箱是否已存在
    // 注意：email 需要转换为小写以确保唯一性检查正确
    const normalizedEmail = email.toLowerCase().trim();
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (existingUser) {
      // 如果用户存在但状态不是 ACTIVE，提供更详细的错误信息
      if (existingUser.status !== 'ACTIVE') {
        throw new ConflictException(
          `该邮箱已被注册，但账户状态为 ${existingUser.status}，请联系管理员`,
        );
      }
      // 用户存在且状态为 ACTIVE，提示用户尝试登录
      throw new ConflictException('该邮箱已被注册，请直接登录或使用"忘记密码"功能');
    }

    // 检查手机号是否已存在（如果提供且不为空）
    if (normalizedPhone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: normalizedPhone },
      });

      if (existingPhone) {
        throw new ConflictException('该手机号已被注册');
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 使用事务确保用户创建和会话创建的原子性
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 创建用户（使用规范化后的邮箱）
        const userData: any = {
          email: normalizedEmail,
          password: hashedPassword,
          name,
          role: 'USER',
          status: 'ACTIVE',
          emailVerified: false,
        };

        // 只有当phone存在且不为空时才添加phone字段
        if (normalizedPhone) {
          userData.phone = normalizedPhone;
          userData.phoneVerified = false;
        }

        const user = await tx.user.create({
          data: userData,
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
            createdAt: true,
          },
        });

        // 生成令牌
        const tokens = await this.generateTokens(user.id, user.email);

        // 创建会话（在事务内）
        const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7天
        await tx.session.create({
          data: {
            userId: user.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: new Date(Date.now() + expiresIn),
          },
        });

        return {
          user,
          tokens,
        };
      });

      return {
        ...result.tokens,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          avatar: result.user.avatar || undefined,
          role: result.user.role,
        },
      };
    } catch (error: any) {
      // 如果是唯一约束冲突（邮箱或手机号），提供更友好的错误信息
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target?.includes('email')) {
          throw new ConflictException('该邮箱已被注册');
        }
        if (target?.includes('phone')) {
          throw new ConflictException('该手机号已被注册');
        }
        throw new ConflictException('注册失败，该邮箱或手机号已被使用');
      }
      // 重新抛出其他错误
      throw error;
    }
  }

  /**
   * 用户登录（使用已验证的用户对象）
   */
  async loginWithUser(user: any, rememberMe?: boolean): Promise<AuthResponseDto> {
    // 检查账户状态
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用，请联系管理员');
    }

    // 确保获取完整的用户信息（包括可能缺失的字段）
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
      },
    });

    if (!fullUser) {
      throw new UnauthorizedException('用户不存在');
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: fullUser.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // 生成令牌
    const expiresIn = rememberMe
      ? this.configService.get<string>('jwt.refreshExpiresIn', '30d')
      : this.configService.get<string>('jwt.expiresIn', '7d');

    const tokens = await this.generateTokens(fullUser.id, fullUser.email, expiresIn);

    // 创建会话
    await this.createSession(
      fullUser.id,
      tokens.accessToken,
      tokens.refreshToken,
      rememberMe,
    );

    return {
      ...tokens,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        avatar: fullUser.avatar || undefined,
        role: fullUser.role,
      },
    };
  }

  /**
   * 用户登录（直接验证）
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password, rememberMe } = loginDto;

    // 验证用户
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 使用已验证的用户对象进行登录
    return this.loginWithUser(user, rememberMe);
  }

  /**
   * 验证用户
   */
  async validateUser(email: string, password: string): Promise<any> {
    // 规范化邮箱（转换为小写并去除空格）
    const normalizedEmail = email.toLowerCase().trim();
    
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        password: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return null;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // 移除密码字段
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // 验证刷新令牌
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      // 查找会话
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              role: true,
              status: true,
            },
          },
        },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('刷新令牌无效或已过期');
      }

      // 检查用户状态
      if (session.user.status !== 'ACTIVE') {
        throw new UnauthorizedException('账户已被禁用');
      }

      // 生成新令牌
      const tokens = await this.generateTokens(
        session.user.id,
        session.user.email,
      );

      // 更新会话
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
        },
      });

      return {
        ...tokens,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          avatar: session.user.avatar || undefined,
          role: session.user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  /**
   * 忘记密码
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return;
    }

    // 生成验证码
    const code = this.generateVerificationCode();

    // 保存验证码
    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10分钟
      },
    });

    // TODO: 发送邮件
    console.log(`密码重置验证码: ${code} (仅用于测试)`);
  }

  /**
   * 重置密码
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    // 查找验证码
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        code: token,
        type: 'PASSWORD_RESET',
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!verificationCode) {
      throw new BadRequestException('验证码无效或已过期');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await this.prisma.user.update({
      where: { id: verificationCode.userId },
      data: {
        password: hashedPassword,
      },
    });

    // 标记验证码为已使用
    await this.prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: {
        used: true,
      },
    });

    // 删除所有会话（强制重新登录）
    await this.prisma.session.deleteMany({
      where: { userId: verificationCode.userId },
    });
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('两次输入的密码不一致');
    }

    // 获取用户
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证当前密码
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  /**
   * 登出
   */
  async logout(userId: string, token: string): Promise<void> {
    // 删除当前会话（使用accessToken匹配）
    await this.prisma.session.deleteMany({
      where: {
        userId,
        accessToken: token,
      },
    });
  }

  /**
   * 登出所有设备
   */
  async logoutAll(userId: string): Promise<void> {
    // 删除所有会话
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * 获取用户信息
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 生成令牌
   */
  private async generateTokens(
    userId: string,
    email: string,
    expiresIn?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const defaultExpiresIn = expiresIn || this.configService.get<string>('jwt.expiresIn', '7d');
    const expiresInSeconds = this.parseExpiresIn(defaultExpiresIn);

    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: defaultExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '30d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: expiresInSeconds,
    };
  }

  /**
   * 创建会话
   */
  private async createSession(
    userId: string,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false,
  ): Promise<void> {
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    await this.prisma.session.create({
      data: {
        userId,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn),
      },
    });
  }

  /**
   * 生成验证码
   */
  private generateVerificationCode(length: number = 6): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  /**
   * 解析过期时间
   */
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60; // 默认7天
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 7 * 24 * 60 * 60;
    }
  }
}
