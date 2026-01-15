import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { AccountType, AccountStatus, CurrencyCode } from '../../core/types';

describe('AccountsService', () => {
  let service: AccountsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    transaction: {
      aggregate: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该成功创建银行账户', async () => {
      const userId = 'user-id';
      const createAccountDto = {
        name: '中国银行储蓄卡',
        type: AccountType.BANK,
        initialBalance: 10000,
        currency: CurrencyCode.CNY,
        description: '主要用于日常消费',
        isDefault: false,
      };

      mockPrismaService.account.create.mockResolvedValue({
        id: 'account-id',
        userId,
        ...createAccountDto,
        balance: 10000,
        color: '#1890ff',
        status: AccountStatus.ACTIVE,
        isShared: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(userId, createAccountDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('中国银行储蓄卡');
      expect(result.type).toBe(AccountType.BANK);
      expect(result.balance).toBe(10000);
      expect(mockPrismaService.account.create).toHaveBeenCalled();
    });

    it('当设为默认账户时应取消其他默认账户', async () => {
      const userId = 'user-id';
      const createAccountDto = {
        name: '默认现金账户',
        type: AccountType.CASH,
        initialBalance: 5000,
        isDefault: true,
      };

      mockPrismaService.account.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.account.create.mockResolvedValue({
        id: 'account-id',
        userId,
        ...createAccountDto,
        balance: 5000,
        currency: 'CNY',
        color: '#1890ff',
        status: AccountStatus.ACTIVE,
        isShared: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.create(userId, createAccountDto);

      expect(mockPrismaService.account.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          isDefault: true,
          deletedAt: null,
        },
        data: {
          isDefault: false,
        },
      });
    });
  });

  describe('findAll', () => {
    it('应该返回账户列表', async () => {
      const userId = 'user-id';
      const query = {
        page: 1,
        limit: 10,
      };

      const mockAccounts = [
        {
          id: 'account-1',
          userId,
          name: '现金账户',
          type: AccountType.CASH,
          balance: 5000,
          currency: CurrencyCode.CNY,
          color: '#1890ff',
          status: AccountStatus.ACTIVE,
          isDefault: true,
          isShared: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.account.findMany.mockResolvedValue(mockAccounts);
      mockPrismaService.account.count.mockResolvedValue(1);

      const result = await service.findAll(userId, query);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('应该根据查询条件过滤账户', async () => {
      const userId = 'user-id';
      const query = {
        type: AccountType.BANK,
        status: AccountStatus.ACTIVE,
        search: '中国银行',
      };

      mockPrismaService.account.findMany.mockResolvedValue([]);
      mockPrismaService.account.count.mockResolvedValue(0);

      await service.findAll(userId, query);

      expect(mockPrismaService.account.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            type: AccountType.BANK,
            status: AccountStatus.ACTIVE,
            OR: expect.arrayContaining([
              { name: { contains: '中国银行', mode: 'insensitive' } },
              { description: { contains: '中国银行', mode: 'insensitive' } },
              { bankName: { contains: '中国银行', mode: 'insensitive' } },
              { accountNumber: { contains: '中国银行', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('应该返回单个账户', async () => {
      const userId = 'user-id';
      const accountId = 'account-id';

      const mockAccount = {
        id: accountId,
        userId,
        name: '现金账户',
        type: AccountType.CASH,
        balance: 5000,
        currency: CurrencyCode.CNY,
        color: '#1890ff',
        status: AccountStatus.ACTIVE,
        isDefault: true,
        isShared: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await service.findOne(userId, accountId);

      expect(result.id).toBe(accountId);
      expect(result.userId).toBe(userId);
      expect(result.name).toBe('现金账户');
    });

    it('当账户不存在时应抛出错误', async () => {
      const userId = 'user-id';
      const accountId = 'non-existent-id';

      mockPrismaService.account.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, accountId)).rejects.toThrow('账户不存在');
    });

    it('当账户不属于用户时应抛出错误', async () => {
      const userId = 'user-id';
      const accountId = 'account-id';

      const mockAccount = {
        id: accountId,
        userId: 'other-user-id', // 不同的用户ID
        name: '现金账户',
        type: AccountType.CASH,
        balance: 5000,
      };

      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      await expect(service.findOne(userId, accountId)).rejects.toThrow('无权访问此账户');
    });
  });

  describe('getOverviewStatistics', () => {
    it('应该返回账户总览统计信息', async () => {
      const userId = 'user-id';

      mockPrismaService.account.findMany.mockResolvedValue([
        { balance: { toNumber: () => 5000 } },
        { balance: { toNumber: () => 3000 } },
        { balance: { toNumber: () => 2000 } },
      ]);

      mockPrismaService.account.groupBy.mockResolvedValue([
        {
          type: AccountType.CASH,
          _sum: { balance: { toNumber: () => 5000 } },
          _count: { id: 1 },
        },
        {
          type: AccountType.BANK,
          _sum: { balance: { toNumber: () => 5000 } },
          _count: { id: 2 },
        },
      ]);

      const result = await service.getOverviewStatistics(userId);

      expect(result.totalBalance).toBe(10000); // 5000 + 3000 + 2000
      expect(result.accountCount).toBe(3);
      expect(result.byType).toHaveLength(2);
      expect(result.byType[0].type).toBe(AccountType.CASH);
      expect(result.byType[0].balance).toBe(5000);
      expect(result.byType[0].count).toBe(1);
    });
  });

  describe('getDefaultAccount', () => {
    it('应该返回默认账户', async () => {
      const userId = 'user-id';

      const mockAccount = {
        id: 'account-id',
        userId,
        name: '默认现金账户',
        type: AccountType.CASH,
        balance: 5000,
        currency: CurrencyCode.CNY,
        color: '#1890ff',
        status: AccountStatus.ACTIVE,
        isDefault: true,
        isShared: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.account.findFirst.mockResolvedValue(mockAccount);

      const result = await service.getDefaultAccount(userId);

      expect(result).toBeTruthy();
      expect(result?.id).toBe('account-id');
      expect(result?.isDefault).toBe(true);
    });

    it('当没有默认账户时应返回null', async () => {
      const userId = 'user-id';

      mockPrismaService.account.findFirst.mockResolvedValue(null);

      const result = await service.getDefaultAccount(userId);

      expect(result).toBeNull();
    });
  });
});
