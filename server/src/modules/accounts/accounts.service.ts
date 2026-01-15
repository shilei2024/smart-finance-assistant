import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountQueryDto } from './dto/account-query.dto';
import { AccountResponseDto } from './dto/account-response.dto';
import { AccountType, AccountStatus } from '../../core/types';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建账户
   */
  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    const {
      name,
      type,
      initialBalance = 0,
      currency,
      isDefault = false,
      ...rest
    } = createAccountDto;

    // 如果设为默认账户，取消其他账户的默认状态
    if (isDefault) {
      await this.prisma.account.updateMany({
        where: {
          userId,
          isDefault: true,
          deletedAt: null,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // 创建账户
    const account = await this.prisma.account.create({
      data: {
        userId,
        name,
        type: type as any, // 类型转换
        balance: initialBalance,
        currency: currency || 'CNY',
        isDefault,
        ...rest,
      },
    });

    return this.mapToResponseDto(account);
  }

  /**
   * 查询账户列表
   */
  async findAll(
    userId: string,
    query: AccountQueryDto,
  ): Promise<{
    data: AccountResponseDto[];
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
      currency,
      search,
      isDefault,
      isShared,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = false,
      includeStatistics = false,
    } = query;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (currency) where.currency = currency;
    if (isDefault !== undefined) where.isDefault = isDefault;
    if (isShared !== undefined) where.isShared = isShared;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { bankName: { contains: search, mode: 'insensitive' } },
        { accountNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 执行查询
    const [accounts, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.account.count({ where }),
    ]);

    // 如果需要统计信息，为每个账户获取统计信息
    let accountsWithStats = accounts;
    if (includeStatistics) {
      accountsWithStats = await Promise.all(
        accounts.map(async (account) => {
          const statistics = await this.getAccountStatistics(account.id);
          // 创建一个新对象，包含统计信息
          const accountWithStats = { ...account };
          (accountWithStats as any).statistics = statistics;
          return accountWithStats;
        }),
      );
    }

    return {
      data: accountsWithStats.map((account) => this.mapToResponseDto(account)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 获取单个账户
   */
  async findOne(
    userId: string,
    id: string,
    includeStatistics: boolean = false,
  ): Promise<AccountResponseDto> {
    const account = await this.prisma.account.findUnique({
      where: { id, deletedAt: null },
    });

    if (!account) {
      throw new NotFoundException('账户不存在');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('无权访问此账户');
    }

    let accountWithStats = account;
    if (includeStatistics) {
      const statistics = await this.getAccountStatistics(id);
      // 创建一个新对象，包含统计信息
      accountWithStats = { ...account };
      (accountWithStats as any).statistics = statistics;
    }

    return this.mapToResponseDto(accountWithStats);
  }

  /**
   * 更新账户
   */
  async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountResponseDto> {
    // 检查账户是否存在且属于当前用户
    await this.findOne(userId, id);

    const { isDefault, ...rest } = updateAccountDto;

    // 如果设为默认账户，取消其他账户的默认状态
    if (isDefault === true) {
      await this.prisma.account.updateMany({
        where: {
          userId,
          id: { not: id },
          isDefault: true,
          deletedAt: null,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // 更新账户
    const updateData: any = {
      ...rest,
      ...(isDefault !== undefined ? { isDefault } : {}),
    };

    // 处理类型字段
    if (updateData.type) {
      updateData.type = updateData.type as any;
    }

    const account = await this.prisma.account.update({
      where: { id },
      data: updateData,
    });

    return this.mapToResponseDto(account);
  }

  /**
   * 删除账户（软删除）
   */
  async remove(userId: string, id: string): Promise<void> {
    // 检查账户是否存在且属于当前用户
    const account = await this.findOne(userId, id);

    // 检查账户是否有未完成的交易
    const hasActiveTransactions = await this.prisma.transaction.count({
      where: {
        OR: [
          { accountId: id, status: 'PENDING' },
          { toAccountId: id, status: 'PENDING' },
        ],
        deletedAt: null,
      },
    });

    if (hasActiveTransactions > 0) {
      throw new BadRequestException('账户有待处理的交易，无法删除');
    }

    // 如果是默认账户，需要设置另一个账户为默认
    if (account.isDefault) {
      const otherAccount = await this.prisma.account.findFirst({
        where: {
          userId,
          id: { not: id },
          deletedAt: null,
          status: AccountStatus.ACTIVE,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (otherAccount) {
        await this.prisma.account.update({
          where: { id: otherAccount.id },
          data: { isDefault: true },
        });
      }
    }

    // 软删除
    await this.prisma.account.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: AccountStatus.CLOSED,
      },
    });
  }

  /**
   * 获取账户统计信息
   */
  async getAccountStatistics(accountId: string) {
    const [incomeStats, expenseStats, lastTransaction] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          accountId,
          type: 'INCOME',
          status: 'COMPLETED',
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          accountId,
          type: 'EXPENSE',
          status: 'COMPLETED',
          deletedAt: null,
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.transaction.findFirst({
        where: {
          OR: [{ accountId }, { toAccountId: accountId }],
          deletedAt: null,
        },
        orderBy: { transactionDate: 'desc' },
        select: { transactionDate: true },
      }),
    ]);

    return {
      totalIncome: incomeStats._sum.amount || 0,
      totalExpense: expenseStats._sum.amount || 0,
      transactionCount: (incomeStats._count.id || 0) + (expenseStats._count.id || 0),
      lastTransactionDate: lastTransaction?.transactionDate,
    };
  }

  /**
   * 获取账户总览统计
   */
  async getOverviewStatistics(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
        deletedAt: null,
        status: AccountStatus.ACTIVE,
      },
    });

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const accountCount = accounts.length;

    const byType = await this.prisma.account.groupBy({
      by: ['type'],
      where: {
        userId,
        deletedAt: null,
        status: AccountStatus.ACTIVE,
      },
      _sum: {
        balance: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalBalance,
      accountCount,
      byType: byType.map((item) => ({
        type: item.type,
        balance: item._sum.balance || 0,
        count: item._count.id || 0,
      })),
    };
  }

  /**
   * 获取默认账户
   */
  async getDefaultAccount(userId: string): Promise<AccountResponseDto | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
        isDefault: true,
        deletedAt: null,
        status: AccountStatus.ACTIVE,
      },
    });

    return account ? this.mapToResponseDto(account) : null;
  }

  /**
   * 更新账户余额
   */
  async updateBalance(
    accountId: string,
    amount: number,
    operation: 'increment' | 'decrement',
  ): Promise<void> {
    const updateData = {
      balance: operation === 'increment' ? { increment: amount } : { decrement: amount },
    };

    await this.prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });
  }

  /**
   * 映射到响应DTO
   */
  private mapToResponseDto(account: any): AccountResponseDto {
    // 处理Decimal类型
    const convertDecimal = (value: any): number => {
      if (!value) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'object' && 'toNumber' in value) {
        return value.toNumber();
      }
      return parseFloat(value.toString());
    };

    // 构建响应对象
    const response: any = {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
      balance: convertDecimal(account.balance),
      currency: account.currency,
      description: account.description,
      color: account.color,
      icon: account.icon,
      status: account.status,
      isDefault: account.isDefault,
      isShared: account.isShared,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      cardNumber: account.cardNumber,
      cardHolder: account.cardHolder,
      expiryDate: account.expiryDate,
      cvv: account.cvv,
      creditLimit: convertDecimal(account.creditLimit),
      billingDay: account.billingDay,
      dueDay: account.dueDay,
      investmentType: account.investmentType,
      riskLevel: account.riskLevel,
      loanAmount: convertDecimal(account.loanAmount),
      interestRate: convertDecimal(account.interestRate),
      loanTerm: account.loanTerm,
      startDate: account.startDate,
      endDate: account.endDate,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      deletedAt: account.deletedAt,
    };

    // 添加统计信息（如果存在）
    if (account.statistics) {
      response.statistics = account.statistics;
    }

    return response;
  }
}
