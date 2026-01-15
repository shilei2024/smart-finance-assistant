import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { BudgetPeriod, CurrencyCode } from '../../core/types';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    budget: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    transaction: {
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('应该成功创建月度预算', async () => {
      const userId = 'user-id';
      const createBudgetDto = {
        name: '2024年1月餐饮预算',
        period: BudgetPeriod.MONTHLY,
        amount: 5000,
        currency: CurrencyCode.CNY,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true,
        alertThresholds: [50, 80, 90, 100],
        isAlertEnabled: true,
      };

      mockPrismaService.budget.create.mockResolvedValue({
        id: 'budget-id',
        userId,
        ...createBudgetDto,
        spentAmount: 0,
        remainingAmount: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 0 } },
      });

      mockPrismaService.budget.findUnique.mockResolvedValue({
        id: 'budget-id',
        userId,
        ...createBudgetDto,
        amount: { toNumber: () => 5000 },
        spentAmount: { toNumber: () => 0 },
        remainingAmount: { toNumber: () => 5000 },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(userId, createBudgetDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('2024年1月餐饮预算');
      expect(result.period).toBe(BudgetPeriod.MONTHLY);
      expect(result.amount).toBe(5000);
      expect(mockPrismaService.budget.create).toHaveBeenCalled();
    });

    it('当开始日期晚于结束日期时应抛出错误', async () => {
      const userId = 'user-id';
      const createBudgetDto = {
        name: '无效预算',
        period: BudgetPeriod.MONTHLY,
        amount: 5000,
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-01-01'), // 结束日期早于开始日期
      };

      await expect(service.create(userId, createBudgetDto)).rejects.toThrow('开始日期必须早于结束日期');
    });
  });

  describe('findAll', () => {
    it('应该返回预算列表', async () => {
      const userId = 'user-id';
      const query = {
        page: 1,
        limit: 10,
      };

      const mockBudgets = [
        {
          id: 'budget-1',
          userId,
          name: '2024年1月餐饮预算',
          period: BudgetPeriod.MONTHLY,
          amount: { toNumber: () => 5000 },
          spentAmount: { toNumber: () => 3000 },
          remainingAmount: { toNumber: () => 2000 },
          currency: CurrencyCode.CNY,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          isActive: true,
          alertThresholds: [50, 80, 90, 100],
          isAlertEnabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.budget.findMany.mockResolvedValue(mockBudgets);
      mockPrismaService.budget.count.mockResolvedValue(1);
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 3000 } },
      });
      mockPrismaService.budget.findUnique.mockResolvedValue({
        ...mockBudgets[0],
        category: null,
      });

      const result = await service.findAll(userId, query);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('应该返回单个预算', async () => {
      const userId = 'user-id';
      const budgetId = 'budget-id';

      const mockBudget = {
        id: 'budget-id',
        userId,
        name: '2024年1月餐饮预算',
        period: BudgetPeriod.MONTHLY,
        amount: { toNumber: () => 5000 },
        spentAmount: { toNumber: () => 3000 },
        remainingAmount: { toNumber: () => 2000 },
        currency: CurrencyCode.CNY,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true,
        alertThresholds: [50, 80, 90, 100],
        isAlertEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // findOne会调用多次findUnique：第一次检查存在，calculateSpentAmount中一次，getCurrentSpentAmount中一次，最后获取更新后的数据
      // 使用mockImplementation确保每次都返回正确的数据
      mockPrismaService.budget.findUnique.mockImplementation((args: any) => {
        if (args.where.id === budgetId) {
          return Promise.resolve({
            ...mockBudget,
            category: null,
          });
        }
        return Promise.resolve(null);
      });
      mockPrismaService.budget.update.mockResolvedValue({
        ...mockBudget,
        category: null,
      });
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 3000 } },
      });

      const result = await service.findOne(userId, budgetId);

      expect(result.id).toBe('budget-id');
      expect(result.userId).toBe(userId);
      expect(result.name).toBe('2024年1月餐饮预算');
    });

    it('当预算不存在时应抛出错误', async () => {
      const userId = 'user-id';
      const budgetId = 'non-existent-id';

      mockPrismaService.budget.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, budgetId)).rejects.toThrow('预算不存在');
    });
  });

  describe('getStatistics', () => {
    it('应该返回预算统计信息', async () => {
      const userId = 'user-id';

      const mockBudgets = [
        {
          id: 'budget-1',
          amount: { toNumber: () => 5000 },
          spentAmount: { toNumber: () => 3000 },
          remainingAmount: { toNumber: () => 2000 },
        },
        {
          id: 'budget-2',
          amount: { toNumber: () => 3000 },
          spentAmount: { toNumber: () => 2000 },
          remainingAmount: { toNumber: () => 1000 },
        },
      ];

      mockPrismaService.budget.findMany
        .mockResolvedValueOnce(mockBudgets)
        .mockResolvedValueOnce(mockBudgets);
      mockPrismaService.budget.groupBy.mockResolvedValue([]);
      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 0 } },
      });

      const result = await service.getStatistics(userId);

      expect(result.totalBudget).toBe(8000); // 5000 + 3000
      expect(result.totalSpent).toBe(5000); // 3000 + 2000
      expect(result.totalRemaining).toBe(3000); // 2000 + 1000
      expect(result.budgetCount).toBe(2);
    });
  });
});
