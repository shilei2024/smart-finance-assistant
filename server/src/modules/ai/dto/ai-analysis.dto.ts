import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AnalysisType {
  OVERVIEW = 'OVERVIEW',
  DETAILED = 'DETAILED',
  COMPARATIVE = 'COMPARATIVE',
}

export class AiAnalysisDto {
  @ApiProperty({
    description: '分析类型',
    enum: AnalysisType,
    example: AnalysisType.OVERVIEW,
    required: false,
  })
  @IsOptional()
  @IsEnum(AnalysisType)
  analysisType?: AnalysisType = AnalysisType.OVERVIEW;

  @ApiProperty({
    description: '开始日期',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: '结束日期',
    example: '2024-01-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({
    description: '关注领域',
    example: ['支出', '储蓄率'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[];
}
