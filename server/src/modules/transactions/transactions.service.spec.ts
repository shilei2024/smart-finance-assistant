import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { TransactionType, TransactionStatus, CurrencyCode } from '../../core/types';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
    },
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该成功创建支出交易', async () => {
      const userId = 'user-id';
      const createTransactionDto = {
        type: TransactionType.EXPENSE,
        amount: 100.5,
        accountId: 'account-id',
        description: '购买办公用品',
      };

      mockPrismaService.account.findUnique.mockResolvedValue({
        id: 'account-id',
        userId,
        currency: CurrencyCode.CNY,
      });

      mockPrismaService.transaction.create.mockResolvedValue({
        id: 'transaction-id',
        userId,
        ...createTransactionDto,
        status: TransactionStatus.COMPLETED,
        currency: CurrencyCode.CNY,
        amount: 100.5,
        exchangeRate: null,
        convertedAmount: 100.5,
        transferFee: null,
        aiConfidence: null,
        transactionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          id: 'account-id',
          name: '现金账户',
          type: 'CASH',
          balance: 1000,
        },
      });

      mockPrismaService.account.update.mockResolvedValue({});

      const result = await service.create(userId, createTransactionDto);

      expect(result).toHaveProperty('id');
      expect(result.type).toBe(TransactionType.EXPENSE);
      expect(result.amount).toBe(100.5);
      expect(mockPrismaService.transaction.create).toHaveBeenCalled();
      expect(mockPrismaService.account.update).toHaveBeenCalled();
    });

    it('应该成功创建收入交易', async () => {
      const userId = 'user-id';
      const createTransactionDto = {
        type: TransactionType.INCOME,
        amount: 2000,
        accountId: 'account-id',
        description: '工资收入',
      };

      mockPrismaService.account.findUnique.mockResolvedValue({
        id: 'account-id',
        userId,
        currency: CurrencyCode.CNY,
      });

      mockPrismaService.transaction.create.mockResolvedValue({
        id: 'transaction-id',
        userId,
        ...createTransactionDto,
        status: TransactionStatus.COMPLETED,
        currency: CurrencyCode.CNY,
        amount: 2000,
        exchangeRate: null,
        convertedAmount: 2000,
        transferFee: null,
        aiConfidence: null,
        transactionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          id: 'account-id',
          name: '银行卡',
          type: 'BANK',
          balance: 5000,
        },
      });

      mockPrismaService.account.update.mockResolvedValue({});

      const result = await service.create(userId, createTransactionDto);

      expect(result.type).toBe(TransactionType.INCOME);
      expect(result.amount).toBe(2000);
    });

    it('当账户不属于用户时应抛出错误', async () => {
      const userId = 'user-id';
      const createTransactionDto = {
        type: TransactionType.EXPENSE,
        amount: 100,
        accountId: 'account-id',
      };

      mockPrismaService.account.findUnique.mockResolvedValue({
        id: 'account-id',
        userId: 'other-user-id', // 不同的用户ID
      });

      await expect(service.create(userId, createTransactionDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('应该返回交易列表', async () => {
      const userId = 'user-id';
      const query = {
        page: 1,
        limit: 10,
      };

      const mockTransactions = [
        {
          id: 'transaction-1',
          userId,
          type: TransactionType.EXPENSE,
          amount: 100,
          currency: CurrencyCode.CNY,
          exchangeRate: null,
          convertedAmount: 100,
          transferFee: null,
          aiConfidence: null,
          status: TransactionStatus.COMPLETED,
          transactionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          account: {
            id: 'account-id',
            name: '现金账户',
            type: 'CASH',
            balance: 1000,
          },
        },
      ];

      mockPrismaService.transaction.findMany.mockResolvedValue(mockTransactions);
      mockPrismaService.transaction.count.mockResolvedValue(1);

      const result = await service.findAll(userId, query);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('应该根据查询条件过滤交易', async () => {
      const userId = 'user-id';
      const query = {
        type: TransactionType.EXPENSE,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        minAmount: 50,
        maxAmount: 200,
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([]);
      mockPrismaService.transaction.count.mockResolvedValue(0);

      await service.findAll(userId, query);

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            type: TransactionType.EXPENSE,
            transactionDate: {
              gte: query.startDate,
              lte: query.endDate,
            },
            amount: {
              gte: query.minAmount,
              lte: query.maxAmount,
            },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('应该返回单个交易', async () => {
      const userId = 'user-id';
      const transactionId = 'transaction-id';

      const mockTransaction = {
        id: transactionId,
        userId,
        type: TransactionType.EXPENSE,
        amount: 100,
        currency: CurrencyCode.CNY,
        exchangeRate: null,
        convertedAmount: 100,
        transferFee: null,
        aiConfidence: null,
        status: TransactionStatus.COMPLETED,
        transactionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          id: 'account-id',
          name: '现金账户',
          type: 'CASH',
          balance: 1000,
        },
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(mockTransaction);

      const result = await service.findOne(userId, transactionId);

      expect(result.id).toBe(transactionId);
      expect(result.userId).toBe(userId);
    });

    it('当交易不存在时应抛出错误', async () => {
      const userId = 'user-id';
      const transactionId = 'non-existent-id';

      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, transactionId)).rejects.toThrow('交易不存在');
    });

    it('当交易不属于用户时应抛出错误', async () => {
      const userId = 'user-id';
      const transactionId = 'transaction-id';

      const mockTransaction = {
        id: transactionId,
        userId: 'other-user-id', // 不同的用户ID
        type: TransactionType.EXPENSE,
        amount: 100,
      };

      mockPrismaService.transaction.findUnique.mockResolvedValue(mockTransaction);

      await expect(service.findOne(userId, transactionId)).rejects.toThrow('无权访问此交易');
    });
  });

  describe('getStatistics', () => {
    it('应该返回交易统计信息', async () => {
      const userId = 'user-id';

      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          type: TransactionType.EXPENSE,
          _sum: { amount: 500 },
          _count: { id: 5 },
        },
        {
          type: TransactionType.INCOME,
          _sum: { amount: 2000 },
          _count: { id: 2 },
        },
      ]);

      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: 2500 },
        _count: { id: 7 },
      });

      const result = await service.getStatistics(userId);

      expect(result.totalAmount).toBe(2500);
      expect(result.totalCount).toBe(7);
      expect(result.byType).toHaveLength(2);
      expect(result.byType[0].type).toBe(TransactionType.EXPENSE);
      expect(result.byType[0].amount).toBe(500);
      expect(result.byType[0].count).toBe(5);
    });
  });
});
