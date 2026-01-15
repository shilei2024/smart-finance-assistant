import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { ReportType, TimeRange } from './dto/report-query.dto';
import { TransactionType, CurrencyCode } from '../../core/types';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    transaction: {
      aggregate: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      findFirst: jest.fn(),
    },
    account: {
      findMany: jest.fn(),
    },
    budget: {
      findMany: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReport', () => {
    it('应该生成总览报表', async () => {
      const userId = 'user-id';
      const query = {
        type: ReportType.OVERVIEW,
        timeRange: TimeRange.MONTH,
      };

      mockPrismaService.transaction.aggregate
        .mockResolvedValueOnce({
          // 收入统计
          _sum: { amount: { toNumber: () => 10000 } },
          _count: { id: 10 },
        })
        .mockResolvedValueOnce({
          // 支出统计
          _sum: { amount: { toNumber: () => 5000 } },
          _count: { id: 40 },
        })
        .mockResolvedValueOnce({
          // 总交易数
          _count: { id: 50 },
        });

      const result = await service.generateReport(userId, query);

      expect(result.type).toBe(ReportType.OVERVIEW);
      expect(result.overview).toBeDefined();
      expect(result.overview?.totalIncome).toBe(10000);
      expect(result.overview?.totalExpense).toBe(5000);
      expect(result.overview?.netIncome).toBe(5000);
      expect(result.overview?.transactionCount).toBe(50);
    });

    it('应该生成分类分析报表', async () => {
      const userId = 'user-id';
      const query = {
        type: ReportType.CATEGORY_ANALYSIS,
        timeRange: TimeRange.MONTH,
      };

      mockPrismaService.transaction.groupBy.mockResolvedValue([
        {
          categoryId: 'category-1',
          type: TransactionType.EXPENSE,
          _sum: { amount: { toNumber: () => 2000 } },
          _count: { id: 20 },
        },
      ]);

      mockPrismaService.category.findMany.mockResolvedValue([
        {
          id: 'category-1',
          name: '餐饮',
          type: TransactionType.EXPENSE,
          color: '#ff4d4f',
          icon: 'food',
        },
      ]);

      const result = await service.generateReport(userId, query);

      expect(result.type).toBe(ReportType.CATEGORY_ANALYSIS);
      expect(result.categoryAnalysis).toBeDefined();
      expect(result.categoryAnalysis?.length).toBeGreaterThan(0);
      expect(result.categoryAnalysis?.[0].categoryName).toBe('餐饮');
    });

    it('应该生成趋势分析报表', async () => {
      const userId = 'user-id';
      const query = {
        type: ReportType.TREND_ANALYSIS,
        timeRange: TimeRange.WEEK,
        groupBy: 'day' as const,
      };

      mockPrismaService.transaction.findMany.mockResolvedValue([
        {
          transactionDate: new Date('2024-01-01'),
          type: TransactionType.INCOME,
          amount: { toNumber: () => 1000 },
        },
        {
          transactionDate: new Date('2024-01-01'),
          type: TransactionType.EXPENSE,
          amount: { toNumber: () => 500 },
        },
      ]);

      const result = await service.generateReport(userId, query);

      expect(result.type).toBe(ReportType.TREND_ANALYSIS);
      expect(result.trendData).toBeDefined();
      expect(result.trendData?.length).toBeGreaterThan(0);
    });
  });

  describe('calculateDateRange', () => {
    it('应该正确计算本月日期范围', async () => {
      const userId = 'user-id';
      const query = {
        type: ReportType.OVERVIEW,
        timeRange: TimeRange.MONTH,
      };

      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 0 } },
        _count: { id: 0 },
      });

      const result = await service.generateReport(userId, query);

      expect(result.timeRange).toContain('to');
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('应该使用自定义日期范围', async () => {
      const userId = 'user-id';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const query = {
        type: ReportType.OVERVIEW,
        timeRange: TimeRange.CUSTOM,
        startDate,
        endDate,
      };

      mockPrismaService.transaction.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 0 } },
        _count: { id: 0 },
      });

      const result = await service.generateReport(userId, query);

      expect(result.timeRange).toContain('2024-01-01');
      expect(result.timeRange).toContain('2024-01-31');
    });
  });
});
