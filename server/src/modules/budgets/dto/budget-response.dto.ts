import { ApiProperty } from '@nestjs/swagger';
import { BudgetPeriod, CurrencyCode } from '../../../core/types';

export class BudgetResponseDto {
  @ApiProperty({
    description: '预算ID',
    example: 'budget-id',
  })
  id: string;

  @ApiProperty({
    description: '用户ID',
    example: 'user-id',
  })
  userId: string;

  @ApiProperty({
    description: '分类ID',
    example: 'category-id',
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: '预算名称',
    example: '2024年1月餐饮预算',
  })
  name: string;

  @ApiProperty({
    description: '预算周期',
    enum: BudgetPeriod,
    example: BudgetPeriod.MONTHLY,
  })
  period: BudgetPeriod;

  @ApiProperty({
    description: '预算金额',
    example: 5000,
  })
  amount: number;

  @ApiProperty({
    description: '货币代码',
    enum: CurrencyCode,
    example: CurrencyCode.CNY,
  })

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01T00:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '结束日期',
    example: '2024-01-31T23:59:59Z',
  })
  endDate: Date;

  @ApiProperty({
    description: '是否激活',
    example: true,
  })

  @ApiProperty({
    description: '提醒阈值（百分比）',
    example: [50, 80, 90, 100],
  })

  @ApiProperty({
    description: '是否启用提醒',
    example: true,
  })

  @ApiProperty({
    description: '已花费金额',
    example: 3000,
  })
  spentAmount: number;

  @ApiProperty({
    description: '剩余金额',
    example: 2000,
  })
  remainingAmount: number;

  @ApiProperty({
    description: '花费百分比',
    example: 60,
  })
  spentPercentage: number;

  @ApiProperty({
    description: '是否超支',
    example: false,
  })
  isExceeded: boolean;

  @ApiProperty({
    description: '分类信息',
    required: false,
  })
  category?: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon?: string;
  };

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-13T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-13T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '删除时间',
    example: '2024-01-13T10:30:00Z',
    required: false,
  })
  deletedAt?: Date;
}
