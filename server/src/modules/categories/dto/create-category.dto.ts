import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { TransactionType } from '../../../core/types';

export class CreateCategoryDto {
  @ApiProperty({
    description: '分类名称',
    example: '餐饮',
  })
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;

  @ApiProperty({
    description: '分类类型',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: '分类图标',
    example: 'food',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: '分类颜色',
    example: '#ff4d4f',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: '父分类ID',
    example: 'parent-category-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: '是否激活',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
