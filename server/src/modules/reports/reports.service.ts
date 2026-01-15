import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ReportQueryDto, ReportType, TimeRange } from './dto/report-query.dto';
import {
  ReportResponseDto,
  OverviewReportDto,
  CategoryAnalysisDto,
  TrendDataDto,
  AccountSummaryDto,
  BudgetAnalysisDto,
} from './dto/report-response.dto';
import { TransactionType, CurrencyCode } from '../../core/types';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 生成报表
   */
  async generateReport(
    userId: string,
    query: ReportQueryDto,
  ): Promise<ReportResponseDto> {
    const { type, timeRange, startDate, endDate } = query;

    // 计算日期范围
    const dateRange = this.calculateDateRange(timeRange, startDate, endDate);

    const report: ReportResponseDto = {
      type: type || ReportType.OVERVIEW,
      timeRange: `${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`,
      generatedAt: new Date(),
    };

    switch (type || ReportType.OVERVIEW) {
      case ReportType.OVERVIEW:
        report.overview = await this.generateOverviewReport(
          userId,
          dateRange,
          query,
        );
        break;
      case ReportType.CATEGORY_ANALYSIS:
        report.categoryAnalysis = await this.generateCategoryAnalysis(
          userId,
          dateRange,
          query,
        );
        break;
      case ReportType.TREND_ANALYSIS:
        report.trendData = await this.generateTrendAnalysis(
          userId,
          dateRange,
          query,
        );
        break;
      case ReportType.ACCOUNT_SUMMARY:
        report.accountSummary = await this.generateAccountSummary(
          userId,
          dateRange,
          query,
        );
        break;
      case ReportType.BUDGET_ANALYSIS:
        report.budgetAnalysis = await this.generateBudgetAnalysis(
          userId,
          dateRange,
          query,
        );
        break;
      case ReportType.INCOME_EXPENSE:
        report.overview = await this.generateOverviewReport(
          userId,
          dateRange,
          query,
        );
        report.trendData = await this.generateTrendAnalysis(
          userId,
          dateRange,
          query,
        );
        break;
      default:
        throw new BadRequestException('不支持的报表类型');
    }

    return report;
  }

  /**
   * 生成总览报表
   */
  private async generateOverviewReport(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): Promise<OverviewReportDto> {
    const where = this.buildTransactionWhere(
      userId,
      dateRange,
      query,
    );

    const [incomeStats, expenseStats, totalStats] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: TransactionType.INCOME,
          status: 'COMPLETED',
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          type: TransactionType.EXPENSE,
          status: 'COMPLETED',
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          ...where,
          status: 'COMPLETED',
        },
        _count: { id: true },
      }),
    ]);

    const totalIncome = incomeStats._sum.amount || 0;
    const totalExpense = expenseStats._sum.amount || 0;
    const netIncome = totalIncome - totalExpense;
    const days = Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) /
        (1000 * 60 * 60 * 24),
    ) || 1;

    return {
      totalIncome,
      totalExpense,
      netIncome,
      transactionCount: totalStats._count.id || 0,
      incomeCount: incomeStats._count.id || 0,
      expenseCount: expenseStats._count.id || 0,
      averageDailyExpense: totalExpense / days,
      averageDailyIncome: totalIncome / days,
      savingRate: totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0,
      currency: query.currency || CurrencyCode.CNY,
    };
  }

  /**
   * 生成分类分析报表
   */
  private async generateCategoryAnalysis(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): Promise<CategoryAnalysisDto[]> {
    const where = this.buildTransactionWhere(
      userId,
      dateRange,
      query,
    );

    const transactions = await this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        ...where,
        status: 'COMPLETED',
        categoryId: { not: null },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    // 获取分类信息
    const categoryIds = [
      ...new Set(transactions.map((t) => t.categoryId).filter(Boolean)),
    ] as string[];

    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
      },
    });

    const categoryMap = new Map(
      categories.map((c) => [c.id, c]),
    );

    // 计算总金额（用于计算百分比）
    const totalAmount = transactions.reduce(
      (sum, t) => sum + (t._sum.amount || 0),
      0,
    );

    const results: CategoryAnalysisDto[] = [];

    transactions.forEach((t) => {
      const category = categoryMap.get(t.categoryId!);
      if (!category) return;

      const amount = t._sum.amount || 0;
      const count = t._count.id || 0;

      results.push({
        categoryId: t.categoryId!,
        categoryName: category.name,
        type: t.type as TransactionType,
        totalAmount: amount,
        transactionCount: count,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        averageAmount: count > 0 ? amount / count : 0,
        color: category.color || undefined,
        icon: category.icon || undefined,
      });
    });

    return results.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * 生成趋势分析报表
   */
  private async generateTrendAnalysis(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): Promise<TrendDataDto[]> {
    const where = this.buildTransactionWhere(
      userId,
      dateRange,
      query,
    );

    const groupBy = query.groupBy || 'day';
    const transactions = await this.prisma.transaction.findMany({
      where: {
        ...where,
        status: 'COMPLETED',
      },
      select: {
        transactionDate: true,
        type: true,
        amount: true,
      },
    });

    // 按日期分组
    const groupedData = new Map<string, { income: number; expense: number; count: number }>();

    transactions.forEach((t) => {
      const date = this.formatDateByGroup(t.transactionDate, groupBy);
      const amount = t.amount;

      if (!groupedData.has(date)) {
        groupedData.set(date, { income: 0, expense: 0, count: 0 });
      }

      const data = groupedData.get(date)!;
      data.count++;

      if (t.type === TransactionType.INCOME) {
        data.income += amount;
      } else if (t.type === TransactionType.EXPENSE) {
        data.expense += amount;
      }
    });

    // 转换为数组并排序
    return Array.from(groupedData.entries())
      .map(([date, data]) => ({
        date,
        income: data.income,
        expense: data.expense,
        netIncome: data.income - data.expense,
        transactionCount: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 生成账户汇总报表
   */
  private async generateAccountSummary(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): Promise<AccountSummaryDto[]> {
    // 处理账户ID列表（可能是字符串或数组）
    const accountIds = Array.isArray(query.accountIds)
      ? query.accountIds
      : query.accountIds
      ? query.accountIds.split(',').filter(Boolean)
      : [];

    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
        ...(accountIds.length > 0 ? { id: { in: accountIds } } : {}),
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        type: true,
        currency: true,
      },
    });

    const summaries = await Promise.all(
      accounts.map(async (account) => {
        // 获取期初余额（日期范围开始前的最后一笔交易后的余额）
        const openingTransaction = await this.prisma.transaction.findFirst({
          where: {
            OR: [
              { accountId: account.id },
              { toAccountId: account.id },
            ],
            transactionDate: { lt: dateRange.start },
            deletedAt: null,
          },
          orderBy: { transactionDate: 'desc' },
        });

        // 计算期初余额（简化处理，实际应该计算所有历史交易）
        const openingBalance = account.type === 'CREDIT_CARD' 
          ? 0 // 信用卡期初余额为0
          : 0; // 简化处理，实际应该从账户创建时开始计算

        // 获取该账户在日期范围内的交易
        const transactions = await this.prisma.transaction.findMany({
          where: {
            OR: [
              { accountId: account.id },
              { toAccountId: account.id },
            ],
            transactionDate: {
              gte: dateRange.start,
              lte: dateRange.end,
            },
            status: 'COMPLETED',
            deletedAt: null,
          },
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((t) => {
          const amount = t.amount;
          if (t.accountId === account.id) {
            if (t.type === TransactionType.INCOME) {
              totalIncome += amount;
            } else if (t.type === TransactionType.EXPENSE) {
              totalExpense += amount;
            } else if (t.type === TransactionType.TRANSFER) {
              totalExpense += amount; // 转出
            }
          } else if (t.toAccountId === account.id) {
            if (t.type === TransactionType.TRANSFER) {
              totalIncome += amount; // 转入
            }
          }
        });

        const closingBalance = openingBalance + totalIncome - totalExpense;

        return {
          accountId: account.id,
          accountName: account.name,
          accountType: account.type,
          openingBalance,
          closingBalance,
          totalIncome,
          totalExpense,
          transactionCount: transactions.length,
          currency: account.currency as CurrencyCode,
        };
      }),
    );

    return summaries;
  }

  /**
   * 生成预算分析报表
   */
  private async generateBudgetAnalysis(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): Promise<BudgetAnalysisDto[]> {
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          {
            startDate: {
              lte: dateRange.end,
              gte: dateRange.start,
            },
          },
          {
            endDate: {
              lte: dateRange.end,
              gte: dateRange.start,
            },
          },
          {
            AND: [
              { startDate: { lte: dateRange.start } },
              { endDate: { gte: dateRange.end } },
            ],
          },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return budgets.map((budget) => {
      const amount = budget.amount;
      const spentAmount = budget.spentAmount;
      const remainingAmount = budget.remainingAmount;
      const spentPercentage = amount > 0 ? (spentAmount / amount) * 100 : 0;

      return {
        budgetId: budget.id,
        budgetName: budget.name,
        budgetAmount: amount,
        spentAmount,
        remainingAmount,
        spentPercentage: Math.round(spentPercentage * 100) / 100,
        isExceeded: spentAmount > amount,
        categoryName: budget.category?.name,
      };
    });
  }

  /**
   * 计算日期范围
   */
  private calculateDateRange(
    timeRange?: TimeRange,
    startDate?: Date,
    endDate?: Date,
  ): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (startDate && endDate) {
      return { start: startDate, end: endDate };
    }

    switch (timeRange) {
      case TimeRange.TODAY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;
      case TimeRange.WEEK:
        start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case TimeRange.MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        break;
      case TimeRange.QUARTER:
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0);
        break;
      case TimeRange.YEAR:
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        break;
      default:
        // 默认最近30天
        start = new Date(now);
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
    }

    return { start, end };
  }

  /**
   * 构建交易查询条件
   */
  private buildTransactionWhere(
    userId: string,
    dateRange: { start: Date; end: Date },
    query: ReportQueryDto,
  ): any {
    const where: any = {
      userId,
      transactionDate: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
      deletedAt: null,
    };

    // 处理账户ID列表（可能是字符串或数组）
    const accountIds = Array.isArray(query.accountIds)
      ? query.accountIds
      : query.accountIds
      ? query.accountIds.split(',').filter(Boolean)
      : [];

    if (accountIds.length > 0) {
      where.OR = [
        { accountId: { in: accountIds } },
        { toAccountId: { in: accountIds } },
      ];
    }

    // 处理分类ID列表（可能是字符串或数组）
    const categoryIds = Array.isArray(query.categoryIds)
      ? query.categoryIds
      : query.categoryIds
      ? query.categoryIds.split(',').filter(Boolean)
      : [];

    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    if (query.transactionType) {
      where.type = query.transactionType;
    }

    if (query.currency) {
      where.currency = query.currency;
    }

    return where;
  }

  /**
   * 按分组格式化日期
   */
  private formatDateByGroup(date: Date, groupBy: string): string {
    const d = new Date(date);
    switch (groupBy) {
      case 'year':
        return `${d.getFullYear()}`;
      case 'month':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      case 'week':
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))).padStart(2, '0')}`;
      default:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
}
