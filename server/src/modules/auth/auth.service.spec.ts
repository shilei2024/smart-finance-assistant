import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    verificationCode: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        'jwt.secret': 'test-secret-key-min-32-chars-long',
        'jwt.expiresIn': '7d',
        'jwt.refreshSecret': 'test-refresh-secret-key-min-32-chars',
        'jwt.refreshExpiresIn': '30d',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('应该成功注册新用户', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: '测试用户',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'user-id',
        email: registerDto.email,
        name: registerDto.name,
        role: 'USER',
        createdAt: new Date(),
      });

      mockJwtService.signAsync.mockResolvedValue('mock-token');
      mockPrismaService.session.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(registerDto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('当邮箱已存在时应抛出错误', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: '测试用户',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow();
    });

    it('当密码不一致时应抛出错误', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'different123',
        name: '测试用户',
      };

      await expect(service.register(registerDto)).rejects.toThrow('两次输入的密码不一致');
    });
  });

  describe('login', () => {
    it('应该成功登录', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        name: '测试用户',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: true,
      });

      mockJwtService.signAsync.mockResolvedValue('mock-token');
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.session.create.mockResolvedValue({});

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('当密码错误时应抛出错误', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
      });

      await expect(service.login(loginDto)).rejects.toThrow();
    });
  });

  describe('validateUser', () => {
    it('应该验证用户凭据', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email,
        password: hashedPassword,
        name: '测试用户',
        role: 'USER',
        status: 'ACTIVE',
        emailVerified: true,
      });

      const result = await service.validateUser(email, password);

      expect(result).toBeTruthy();
      expect(result.email).toBe(email);
      expect(result).not.toHaveProperty('password');
    });

    it('当用户不存在时应返回null', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password');

      expect(result).toBeNull();
    });
  });
});
