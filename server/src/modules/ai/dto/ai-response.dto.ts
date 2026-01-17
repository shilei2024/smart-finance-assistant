import { ApiProperty } from '@nestjs/swagger';
import { SpeechResponseDto } from './speech-request.dto';

class MonthlyComparisonItem {
  @ApiProperty()
  month: string;

  @ApiProperty()
  income: number;

  @ApiProperty()
  expense: number;

  @ApiProperty()
  difference: number;
}

export class ClassificationResponseDto {
  @ApiProperty({
    description: '主要分类',
  })
  primaryCategory: {
    id: string;
    name: string;
    confidence: number;
    reasoning: string;
  };

  @ApiProperty({
    description: '备选分类',
  })
  alternativeCategories: Array<{
    id: string;
    name: string;
    confidence: number;
  }>;

  @ApiProperty({
    description: '提取的标签',
  })
  extractedTags: string[];

  @ApiProperty({
    description: '提取的实体',
  })
  extractedEntities: {
    merchant?: string;
    location?: string;
    time?: string;
  };
}

export class AnalysisResponseDto {
  @ApiProperty({
    description: '摘要',
  })
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingRate: number;
    averageDailySpending: number;
  };

  @ApiProperty({
    description: '财务健康度',
  })
  financialHealth: {
    score: number;
    level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    breakdown: {
      spendingHabits: number;
      savingRate: number;
      budgetAdherence: number;
      incomeStability: number;
    };
    recommendations: string[];
  };

  @ApiProperty({
    description: '洞察',
  })
  insights: Array<{
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    data: any;
    recommendation?: string;
    priority: 'low' | 'medium' | 'high';
  }>;

  @ApiProperty({
    description: '趋势',
    type: 'object',
  })
  trends: {
    spendingByCategory: Record<string, number>;
    monthlyComparison: MonthlyComparisonItem[];
    topSpendingDays: Array<{
      date: string;
      amount: number;
      category: string;
    }>;
  };

  @ApiProperty({
    description: '建议',
  })
  recommendations: Array<{
    category: string;
    currentSpending: number;
    suggestedSpending: number;
    potentialSavings: number;
    actionSteps: string[];
    expectedImpact: string;
  }>;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'AI回复',
    example: '根据您的交易记录，本月总支出为5000元...',
  })
  response: string;

  @ApiProperty({
    description: '相关数据',
    required: false,
  })
  data?: any;

  @ApiProperty({
    description: '建议操作',
    required: false,
  })
  suggestions?: string[];
}

export class OcrResponseDto {
  @ApiProperty({
    description: '提取的交易信息',
  })
  transaction: {
    amount: number;
    currency?: string;
    date?: string;
    merchant?: string;
    description?: string;
    category?: string;
    items?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
  };

  @ApiProperty({
    description: '置信度',
    example: 0.95,
  })
  confidence: number;

  @ApiProperty({
    description: '原始文本',
    required: false,
  })
  rawText?: string;

  @ApiProperty({
    description: '处理时间（毫秒）',
    required: false,
  })
  processingTime?: number;
}

// 重新导出SpeechResponseDto
export { SpeechResponseDto };
