import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('应该成功注册新用户', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          name: '测试用户',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data.user.email).toBe('test@example.com');
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
          userId = res.body.data.user.id;
        });
    });

    it('当邮箱已存在时应返回错误', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          name: '测试用户',
        })
        .expect(409);
    });

    it('当密码不一致时应返回错误', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password123',
          passwordConfirm: 'different123',
          name: '测试用户',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('应该成功登录', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user.email).toBe('test@example.com');
        });
    });

    it('当密码错误时应返回错误', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('应该获取当前用户信息', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe('test@example.com');
        });
    });

    it('当未提供token时应返回401', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('应该成功刷新令牌', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });
  });
});
