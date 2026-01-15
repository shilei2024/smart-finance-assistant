import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册', description: '创建新用户账户' })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱或手机号已被注册' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '使用邮箱和密码登录' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '邮箱或密码错误' })
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: any): Promise<AuthResponseDto> {
    // LocalAuthGuard 已经验证了用户，user 对象已经包含验证后的用户信息
    return this.authService.loginWithUser(user, loginDto.rememberMe);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新令牌', description: '使用刷新令牌获取新的访问令牌' })
  @ApiResponse({
    status: 200,
    description: '刷新成功',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '刷新令牌无效或已过期' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '忘记密码',
    description: '发送密码重置验证码到邮箱',
  })
  @ApiResponse({ status: 200, description: '验证码已发送' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return { message: '如果邮箱存在，验证码已发送到您的邮箱' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重置密码', description: '使用验证码重置密码' })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: '验证码无效或已过期' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: '密码重置成功，请使用新密码登录' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '修改密码', description: '修改当前登录用户的密码' })
  @ApiResponse({ status: 200, description: '密码修改成功' })
  @ApiResponse({ status: 400, description: '当前密码错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user.id, changePasswordDto);
    return { message: '密码修改成功' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '登出', description: '登出当前设备' })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async logout(
    @CurrentUser() user: any,
    @Body('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id, token);
    return { message: '登出成功' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '登出所有设备', description: '登出所有已登录的设备' })
  @ApiResponse({ status: 200, description: '所有设备已登出' })
  @ApiResponse({ status: 401, description: '未授权' })
  async logoutAll(@CurrentUser() user: any): Promise<{ message: string }> {
    await this.authService.logoutAll(user.id);
    return { message: '所有设备已登出' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户信息', description: '获取当前登录用户的详细信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getProfile(@CurrentUser() user: any) {
    const fullUser = await this.authService.getProfile(user.id);
    return fullUser;
  }
}
