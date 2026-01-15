import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class ClassifyTransactionDto {
  @ApiProperty({
    description: '交易描述',
    example: '在星巴克购买咖啡',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '交易金额',
    example: 35.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: '交易地点',
    example: '北京市朝阳区',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: '交易时间',
    example: '2024-01-13T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({
    description: '历史分类',
    example: ['餐饮', '咖啡'],
    required: false,
  })
  @IsOptional()
  historicalCategories?: string[];

  @ApiProperty({
    description: '上下文信息',
    example: { merchant: '星巴克', paymentMethod: '微信支付' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}
