import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetQueryDto } from './dto/budget-query.dto';
import { BudgetResponseDto } from './dto/budget-response.dto';
import { BudgetPeriod, TransactionType } from '../../core/types';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建预算
   */
  async create(
    userId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<BudgetResponseDto> {
    const {
      name,
      period,
      amount,
      categoryId,
      startDate,
      endDate,
    } = createBudgetDto;

    // 验证日期范围
    if (startDate >= endDate) {
      throw new BadRequestException('开始日期必须早于结束日期');
    }

    // 验证分类（如果提供）
    if (categoryId) {
      await this.validateCategoryOwnership(userId, categoryId);
    }

    // 创建预算
    const budget = await this.prisma.budget.create({
      data: {
        userId,
        name,
        period: period as any, // 类型转换
        amount,
        categoryId,
        startDate,
        endDate,
        spentAmount: 0,
        remainingAmount: amount,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    // 计算花费金额
    await this.calculateSpentAmount(budget.id);

    // 重新获取预算（包含计算后的数据）
    const updatedBudget = await this.prisma.budget.findUnique({
      where: { id: budget.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return this.mapToResponseDto(updatedBudget!);
  }

  /**
   * 查询预算列表
   */
  async findAll(
    userId: string,
    query: BudgetQueryDto,
  ): Promise<{
    data: BudgetResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      period,
      categoryId,
      startDate,
      endDate,
      search,
      sortBy = 'startDate',
      sortOrder = 'desc',
      includeDeleted = false,
    } = query;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    if (period) where.period = period;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
        {
          endDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
        {
          AND: [
            { startDate: { lte: startDate || undefined } },
            { endDate: { gte: endDate || undefined } },
          ],
        },
      ];
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // 执行查询
    const [budgets, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
              icon: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.budget.count({ where }),
    ]);

    // 计算每个预算的花费
    await Promise.all(
      budgets.map((budget) => this.calculateSpentAmount(budget.id)),
    );

    // 重新获取预算（包含计算后的数据）
    const updatedBudgets = await Promise.all(
      budgets.map((budget) =>
        this.prisma.budget.findUnique({
          where: { id: budget.id },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        }),
      ),
    );

    return {
      data: updatedBudgets
        .filter((b) => b !== null)
        .map((budget) => this.mapToResponseDto(budget!)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取单个预算
   */
  async findOne(
    userId: string,
    id: string,
  ): Promise<BudgetResponseDto> {
    const budget = await this.prisma.budget.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('预算不存在');
    }

    if (budget.userId !== userId) {
      throw new ForbiddenException('无权访问此预算');
    }

    // 计算花费金额
    await this.calculateSpentAmount(id);

    // 重新获取预算（包含计算后的数据）
    const updatedBudget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return this.mapToResponseDto(updatedBudget!);
  }

  /**
   * 更新预算
   */
  async update(
    userId: string,
    id: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<BudgetResponseDto> {
    // 检查预算是否存在且属于当前用户
    await this.findOne(userId, id);

    const { startDate, endDate, categoryId, ...rest } = updateBudgetDto;

    // 验证日期范围
    if (startDate && endDate && startDate >= endDate) {
      throw new BadRequestException('开始日期必须早于结束日期');
    }

    // 验证分类（如果更新分类）
    if (categoryId) {
      await this.validateCategoryOwnership(userId, categoryId);
    }

    // 更新预算
    const budget = await this.prisma.budget.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(rest.amount !== undefined
          ? { remainingAmount: rest.amount - (await this.getCurrentSpentAmount(id)) }
          : {}),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    // 重新计算花费金额
    await this.calculateSpentAmount(id);

    // 重新获取预算（包含计算后的数据）
    const updatedBudget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return this.mapToResponseDto(updatedBudget!);
  }

  /**
   * 删除预算（软删除）
   */
  async remove(userId: string, id: string): Promise<void> {
    // 检查预算是否存在且属于当前用户
    await this.findOne(userId, id);

    // 软删除
    await this.prisma.budget.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 计算预算花费金额
   */
  async calculateSpentAmount(budgetId: string): Promise<void> {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) return;

    const spentAmount = await this.getCurrentSpentAmount(budgetId);
    const remainingAmount = budget.amount - spentAmount;

    await this.prisma.budget.update({
      where: { id: budgetId },
      data: {
        spentAmount,
        remainingAmount,
      },
    });
  }

  /**
   * 获取当前花费金额
   */
  private async getCurrentSpentAmount(budgetId: string): Promise<number> {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) return 0;

    const where: any = {
      userId: budget.userId,
      type: TransactionType.EXPENSE,
      status: 'COMPLETED',
      transactionDate: {
        gte: budget.startDate,
        lte: budget.endDate,
      },
      deletedAt: null,
    };

    // 如果预算关联了分类，只统计该分类的交易
    if (budget.categoryId) {
      where.categoryId = budget.categoryId;
    }

    const result = await this.prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * 获取预算统计
   */
  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
        {
          endDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
      ];
    }

    const budgets = await this.prisma.budget.findMany({
      where,
    });

    // 计算每个预算的花费
    await Promise.all(
      budgets.map((budget) => this.calculateSpentAmount(budget.id)),
    );

    // 重新获取预算（包含计算后的数据）
    const updatedBudgets = await this.prisma.budget.findMany({
      where: {
        id: { in: budgets.map((b) => b.id) },
      },
    });

    const totalBudget = updatedBudgets.reduce(
      (sum, b) => sum + b.amount,
      0,
    );
    const totalSpent = updatedBudgets.reduce(
      (sum, b) => sum + b.spentAmount,
      0,
    );
    const totalRemaining = updatedBudgets.reduce(
      (sum, b) => sum + b.remainingAmount,
      0,
    );

    const exceededCount = updatedBudgets.filter(
      (b) => b.spentAmount > b.amount,
    ).length;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      budgetCount: budgets.length,
      exceededCount,
      averageSpentPercentage:
        budgets.length > 0
          ? (totalSpent / totalBudget) * 100
          : 0,
      byPeriod: await this.getStatisticsByPeriod(userId, startDate, endDate),
    };
  }

  /**
   * 按周期获取统计
   */
  private async getStatisticsByPeriod(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
        {
          endDate: {
            lte: endDate || undefined,
            gte: startDate || undefined,
          },
        },
      ];
    }

    const budgets = await this.prisma.budget.groupBy({
      by: ['period'],
      where,
      _sum: {
        amount: true,
        spentAmount: true,
      },
      _count: {
        id: true,
      },
    });

    return budgets.map((item) => ({
      period: item.period,
      totalBudget: item._sum.amount || 0,
      totalSpent: item._sum.spentAmount || 0,
      count: item._count.id || 0,
    }));
  }

  /**
   * 验证分类所有权
   */
  private async validateCategoryOwnership(
    userId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('无权访问此分类');
    }

    return category;
  }

  /**
   * 映射到响应DTO
   */
  private mapToResponseDto(budget: any): BudgetResponseDto {
    // 处理Decimal类型
    const convertDecimal = (value: any): number => {
      if (!value) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'object' && 'toNumber' in value) {
        return value.toNumber();
      }
      return parseFloat(value.toString());
    };

    const amount = convertDecimal(budget.amount);
    const spentAmount = convertDecimal(budget.spentAmount);
    const remainingAmount = convertDecimal(budget.remainingAmount);
    const spentPercentage = amount > 0 ? (spentAmount / amount) * 100 : 0;
    const isExceeded = spentAmount > amount;

    return {
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      name: budget.name,
      period: budget.period,
      amount,
      startDate: budget.startDate,
      endDate: budget.endDate,
      spentAmount,
      remainingAmount,
      spentPercentage: Math.round(spentPercentage * 100) / 100,
      isExceeded,
      category: budget.category,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      deletedAt: budget.deletedAt,
    };
  }
}
