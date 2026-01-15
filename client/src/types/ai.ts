export interface ClassifyTransactionDto {
  description?: string;
  amount?: number;
  location?: string;
  time?: string;
  historicalCategories?: string[];
  context?: Record<string, any>;
}

export interface ClassificationResponseDto {
  primaryCategory: {
    id: string;
    name: string;
    confidence: number;
    reasoning: string;
  };
  alternativeCategories: Array<{
    id: string;
    name: string;
    confidence: number;
  }>;
  extractedTags: string[];
  extractedEntities: {
    merchant?: string;
    location?: string;
    time?: string;
  };
}

export enum AnalysisType {
  OVERVIEW = 'OVERVIEW',
  DETAILED = 'DETAILED',
  COMPARATIVE = 'COMPARATIVE',
}

export interface AiAnalysisDto {
  analysisType?: AnalysisType;
  startDate?: string;
  endDate?: string;
  focusAreas?: string[];
}

export interface AnalysisResponseDto {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingRate: number;
    averageDailySpending: number;
  };
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
  insights: Array<{
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    data: any;
    recommendation?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  trends: {
    spendingByCategory: Record<string, number>;
    monthlyComparison: Array<{
      month: string;
      income: number;
      expense: number;
      difference: number;
    }>;
    topSpendingDays: Array<{
      date: string;
      amount: number;
      category: string;
    }>;
  };
  recommendations: Array<{
    category: string;
    currentSpending: number;
    suggestedSpending: number;
    potentialSavings: number;
    actionSteps: string[];
    expectedImpact: string;
  }>;
}

export interface AiChatDto {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponseDto {
  response: string;
  data?: any;
  suggestions?: string[];
}

export enum OcrType {
  RECEIPT = 'RECEIPT',
  INVOICE = 'INVOICE',
  BILL = 'BILL',
}

export interface OcrRequestDto {
  image: string;
  type?: OcrType;
}

export interface OcrResponseDto {
  transaction: {
    amount: number;
    currency?: string;
    date?: string | null;
    merchant?: string;
    description?: string;
    category?: string;
    items?: string[] | Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
  };
  confidence: number;
  rawText?: string;
  processingTime?: number;
}
