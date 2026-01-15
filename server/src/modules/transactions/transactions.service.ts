import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { TransactionType, TransactionStatus } from '../../core/types';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建交易
   */
  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const {
      type,
      accountId,
      toAccountId,
      amount,
      currency,
      ...rest
    } = createTransactionDto;

    // 验证账户所有权
    const account = await this.validateAccountOwnership(userId, accountId);
    
    // 验证目标账户（如果是转账）
    let toAccount = null;
    if (type === TransactionType.TRANSFER) {
      if (!toAccountId) {
        throw new BadRequestException('转账交易必须指定目标账户');
      }
      if (accountId === toAccountId) {
        throw new BadRequestException('不能转账到同一账户');
      }
      toAccount = await this.validateAccountOwnership(userId, toAccountId);
    }

    // 验证分类（如果提供）
    if (rest.categoryId) {
      await this.validateCategoryOwnership(userId, rest.categoryId, type);
    }

    // 创建交易
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type,
        status: rest.status || TransactionStatus.COMPLETED,
        amount,
        currency: currency || account.currency,
        accountId,
        toAccountId,
        categoryId: rest.categoryId,
        transactionDate: rest.transactionDate || new Date(),
        description: rest.description || '',
        location: rest.location,
        tags: Array.isArray(rest.tags) ? rest.tags.join(',') : rest.tags || null,
        attachmentUrls: Array.isArray(rest.attachmentUrls) ? rest.attachmentUrls.join(',') : rest.attachmentUrls || null,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
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

    // 更新账户余额
    await this.updateAccountBalances(transaction);

    return this.mapToResponseDto(transaction);
  }

  /**
   * 查询交易列表
   */
  async findAll(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{
    data: TransactionResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      accountId,
      categoryId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      currency,
      search,
      tags,
      sortBy = 'transactionDate',
      sortOrder = 'desc',
      includeDeleted = false,
    } = query;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = startDate;
      if (endDate) where.transactionDate.lte = endDate;
    }
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) where.amount.gte = minAmount;
      if (maxAmount !== undefined) where.amount.lte = maxAmount;
    }
    if (currency) where.currency = currency;
    if (tags && tags.length > 0) {
      where.tags = { hasEvery: tags };
    }
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { payee: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 执行查询
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              balance: true,
            },
          },
          toAccount: {
            select: {
              id: true,
              name: true,
              type: true,
              balance: true,
            },
          },
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
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map((transaction) => this.mapToResponseDto(transaction)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取单个交易
   */
  async findOne(
    userId: string,
    id: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id, deletedAt: null },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
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

    if (!transaction) {
      throw new NotFoundException('交易不存在');
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException('无权访问此交易');
    }

    return this.mapToResponseDto(transaction);
  }

  /**
   * 更新交易
   */
  async update(
    userId: string,
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // 检查交易是否存在且属于当前用户
    const existingTransaction = await this.findOne(userId, id);

    // 验证账户所有权（如果更新账户）
    if (updateTransactionDto.accountId) {
      await this.validateAccountOwnership(userId, updateTransactionDto.accountId);
    }

    // 验证目标账户（如果是转账）
    if (updateTransactionDto.toAccountId) {
      await this.validateAccountOwnership(userId, updateTransactionDto.toAccountId);
    }

    // 验证分类（如果更新分类）
    if (updateTransactionDto.categoryId) {
      const type = updateTransactionDto.type || existingTransaction.type;
      await this.validateCategoryOwnership(userId, updateTransactionDto.categoryId, type);
    }

    // 过滤掉不存在的字段并转换数组为字符串
    const { exchangeRate, convertedAmount, transferFee, isRecurring, recurringRule, nextOccurrence, payee, aiProcessed, aiConfidence, ...validData } = updateTransactionDto as any;
    
    // 处理 tags 和 attachmentUrls
    if (validData.tags && Array.isArray(validData.tags)) {
      validData.tags = validData.tags.join(',');
    }
    if (validData.attachmentUrls && Array.isArray(validData.attachmentUrls)) {
      validData.attachmentUrls = validData.attachmentUrls.join(',');
    }

    // 更新交易
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: validData,
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            name: true,
            type: true,
            balance: true,
          },
        },
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

    // 重新计算账户余额
    await this.updateAccountBalances(transaction);

    return this.mapToResponseDto(transaction);
  }

  /**
   * 删除交易（软删除）
   */
  async remove(userId: string, id: string): Promise<void> {
    // 检查交易是否存在且属于当前用户
    const transaction = await this.findOne(userId, id);

    // 软删除
    await this.prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // 重新计算账户余额
    await this.updateAccountBalances(transaction);
  }

  /**
   * 获取交易统计
   */
  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = startDate;
      if (endDate) where.transactionDate.lte = endDate;
    }

    const transactions = await this.prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const total = await this.prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalAmount: total._sum.amount || 0,
      totalCount: total._count.id || 0,
      byType: transactions.map((item) => ({
        type: item.type,
        amount: item._sum.amount || 0,
        count: item._count.id || 0,
      })),
    };
  }

  /**
   * 验证账户所有权
   */
  private async validateAccountOwnership(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId, deletedAt: null },
    });

    if (!account) {
      throw new NotFoundException('账户不存在');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('无权访问此账户');
    }

    return account;
  }

  /**
   * 验证分类所有权
   */
  private async validateCategoryOwnership(
    userId: string,
    categoryId: string,
    type: TransactionType,
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

    if (category.type !== type) {
      throw new BadRequestException('分类类型与交易类型不匹配');
    }

    return category;
  }

  /**
   * 更新账户余额
   */
  private async updateAccountBalances(transaction: any) {
    const { type, accountId, toAccountId, amount, status } = transaction;

    // 只处理已完成的交易
    if (status !== TransactionStatus.COMPLETED) {
      return;
    }

    // 更新源账户余额
    if (type === TransactionType.EXPENSE) {
      // 支出：减少余额
      await this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: { decrement: amount },
        },
      });
    } else if (type === TransactionType.INCOME) {
      // 收入：增加余额
      await this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: { increment: amount },
        },
      });
    } else if (type === TransactionType.TRANSFER && toAccountId) {
      // 转账：从源账户扣除，向目标账户增加
      await Promise.all([
        this.prisma.account.update({
          where: { id: accountId },
          data: {
            balance: { decrement: amount },
          },
        }),
        this.prisma.account.update({
          where: { id: toAccountId },
          data: {
            balance: { increment: amount },
          },
        }),
      ]);
    }
  }

  /**
   * 映射到响应DTO
   */
  private mapToResponseDto(transaction: any): TransactionResponseDto {
    // 处理Decimal类型
    const convertDecimal = (value: any): number => {
      if (!value) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'object' && 'toNumber' in value) {
        return value.toNumber();
      }
      return parseFloat(value.toString());
    };

    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      status: transaction.status,
      amount: convertDecimal(transaction.amount),
      currency: transaction.currency,
      accountId: transaction.accountId,
      toAccountId: transaction.toAccountId,
      categoryId: transaction.categoryId,
      transactionDate: transaction.transactionDate,
      description: transaction.description,
      location: transaction.location,
      tags: transaction.tags ? transaction.tags.split(',') : [],
      attachmentUrls: transaction.attachmentUrls ? transaction.attachmentUrls.split(',') : [],
      aiSuggestions: transaction.aiSuggestions as Record<string, any>,
      account: transaction.account,
      toAccount: transaction.toAccount,
      category: transaction.category,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      deletedAt: transaction.deletedAt,
    };
  }
}
