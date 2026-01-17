import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { AiProviderService } from './services/ai-provider.service';
import { ClassifyTransactionDto } from './dto/classify-transaction.dto';
import { AiAnalysisDto, AnalysisType } from './dto/ai-analysis.dto';
import { AiChatDto } from './dto/ai-chat.dto';
import { OcrRequestDto } from './dto/ocr-request.dto';
import { SpeechRequestDto } from './dto/speech-request.dto';
import {
  ClassificationResponseDto,
  AnalysisResponseDto,
  ChatResponseDto,
  OcrResponseDto,
  SpeechResponseDto,
} from './dto/ai-response.dto';
import { TransactionType } from '../../core/types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiProvider: AiProviderService,
  ) {}

  /**
   * 分类交易
   */
  async classifyTransaction(
    userId: string,
    dto: ClassifyTransactionDto,
  ): Promise<ClassificationResponseDto> {
    // 获取用户的分类列表
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    // 构建提示词
    const prompt = this.buildClassificationPrompt(dto, categories);

    // 调用AI
    const aiResponse = await this.aiProvider.chat([
      {
        role: 'system',
        content: '你是一个专业的财务分类助手，帮助用户将交易分类到合适的类别。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    // 解析AI响应
    return this.parseClassificationResponse(aiResponse, categories);
  }

  /**
   * 生成财务分析
   */
  async generateAnalysis(
    userId: string,
    dto: AiAnalysisDto,
  ): Promise<AnalysisResponseDto> {
    // 计算日期范围
    const endDate = dto.endDate ? new Date(dto.endDate) : new Date();
    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    // 获取交易数据
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
        status: 'COMPLETED',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // 获取预算数据
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    // 构建分析提示词
    const prompt = this.buildAnalysisPrompt(
      transactions,
      budgets,
      dto.analysisType || AnalysisType.OVERVIEW,
      dto.focusAreas,
    );

    // 调用AI
    const aiResponse = await this.aiProvider.chat([
      {
        role: 'system',
        content: '你是一个专业的财务分析师，帮助用户分析财务状况并提供建议。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    // 解析AI响应并计算统计数据
    return this.parseAnalysisResponse(aiResponse, transactions, budgets);
  }

  /**
   * AI对话
   */
  async chat(userId: string, dto: AiChatDto): Promise<ChatResponseDto> {
    // 获取用户最近的交易数据（用于上下文）
    const recentTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        transactionDate: 'desc',
      },
      take: 10,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // 构建对话历史
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: `你是一个智能记账助手，可以帮助用户管理财务、分析支出、提供建议等。
用户最近的交易记录：
${recentTransactions
  .map(
    (t) =>
      `- ${t.category?.name || '未分类'} ${t.type === 'INCOME' ? '收入' : '支出'} ¥${t.amount} ${t.description || ''}`,
  )
  .join('\n')}`,
      },
    ];

    // 添加历史对话
    if (dto.history && dto.history.length > 0) {
      dto.history.forEach((msg) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      });
    }

    // 添加当前消息
    messages.push({
      role: 'user',
      content: dto.message,
    });

    // 调用AI
    const response = await this.aiProvider.chat(messages);

    // 记录AI处理（注释掉，因为 schema 中没有 aiProcessing 模型）
    // await this.prisma.aiProcessing.create({
    //   data: {
    //     userId,
    //     requestType: 'CHAT',
    //     requestData: { message: dto.message },
    //     responseData: { response },
    //     model: 'deepseek-chat',
    //     tokensUsed: response.length / 4, // 粗略估算
    //     processingTime: 1000,
    //     success: true,
    //   },
    // });

    return {
      response,
      suggestions: this.extractSuggestions(response),
    };
  }

  /**
   * 语音识别
   */
  async recognizeSpeech(
    userId: string,
    dto: SpeechRequestDto,
  ): Promise<SpeechResponseDto> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`开始语音识别，用户ID: ${userId}, 语言: ${dto.language}`);

      // 构建语音识别提示词
      const prompt = this.buildSpeechRecognitionPrompt(dto);

      // 调用AI进行语音识别
      const aiResponse = await this.aiProvider.chat([
        {
          role: 'system',
          content: `你是一个专业的语音识别助手，专门识别财务相关的语音内容。
          你需要从音频中识别出：
          1. 交易金额和货币
          2. 商家或收款方
          3. 交易类别（餐饮、交通、购物等）
          4. 交易时间（如果提到）
          5. 其他相关细节
          
          语言: ${dto.language}
          置信度阈值: ${dto.confidenceThreshold}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      // 解析语音识别结果
      const result = this.parseSpeechRecognitionResponse(aiResponse, dto);

      // 记录处理时间
      const processingTime = Date.now() - startTime;
      result.processingTime = processingTime;

      this.logger.log(`语音识别完成，处理时间: ${processingTime}ms, 置信度: ${result.confidence}`);

      return result;

    } catch (error) {
      this.logger.error(`语音识别失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 构建语音识别提示词
   */
  private buildSpeechRecognitionPrompt(dto: SpeechRequestDto): string {
    return `
请分析以下语音内容，提取财务交易信息：

## 输入信息
- 音频数据: ${dto.audio.substring(0, 100)}... (${dto.audio.length} 字符)
- 音频格式: ${dto.format}
- 语言: ${dto.language}

## 输出要求
返回JSON格式：
{
  "text": "识别出的完整文本",
  "confidence": 0.95,
  "language": "${dto.language}",
  "entities": {
    "amount": 金额数字,
    "currency": "货币代码（如CNY、USD）",
    "merchant": "商家名称",
    "category": "交易类别",
    "time": "交易时间（如果提到）",
    "description": "交易描述"
  }
}

## 注意事项
1. 如果无法确定某些信息，对应字段可以为null
2. 置信度要反映识别的确定性
3. 金额要转换为数字格式
4. 类别要标准化（餐饮、交通、购物等）
    `;
  }

  /**
   * 解析语音识别响应
   */
  private parseSpeechRecognitionResponse(
    aiResponse: string,
    dto: SpeechRequestDto,
  ): SpeechResponseDto {
    try {
      // 尝试解析JSON响应
      const parsed = JSON.parse(aiResponse);

      return {
        text: parsed.text || '',
        confidence: parsed.confidence || 0.5,
        language: parsed.language || dto.language,
        entities: parsed.entities || {},
        processingTime: 0, // 将在外部设置
      };
    } catch (error) {
      // 如果AI没有返回JSON，使用文本分析
      this.logger.warn('AI响应不是有效的JSON，使用文本分析');

      // 简单的文本分析
      const text = aiResponse;
      const confidence = this.estimateSpeechConfidence(text);

      // 尝试提取实体
      const entities = this.extractEntitiesFromText(text);

      return {
        text,
        confidence,
        language: dto.language || 'zh-CN',
        entities,
        processingTime: 0,
      };
    }
  }

  /**
   * 估计语音识别置信度
   */
  private estimateSpeechConfidence(text: string): number {
    // 简单的置信度估计
    const hasAmount = /\d+(\.\d{1,2})?/.test(text);
    const hasKeywords = /(消费|花费|支付|买了|吃饭|打车|购物)/.test(text);
    
    let confidence = 0.5;
    if (hasAmount) confidence += 0.2;
    if (hasKeywords) confidence += 0.2;
    if (text.length > 10) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  /**
   * 从文本中提取实体
   */
  private extractEntitiesFromText(text: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // 提取金额
    const amountMatch = text.match(/(\d+(\.\d{1,2})?)\s*(元|块|¥|￥)/);
    if (amountMatch) {
      entities.amount = parseFloat(amountMatch[1]);
      entities.currency = 'CNY';
    }

    // 提取商家（简单关键词匹配）
    const merchantKeywords = ['星巴克', '麦当劳', '肯德基', '超市', '商场', '淘宝', '京东'];
    for (const keyword of merchantKeywords) {
      if (text.includes(keyword)) {
        entities.merchant = keyword;
        break;
      }
    }

    // 提取类别
    const categoryKeywords = {
      '餐饮': ['吃饭', '餐厅', '外卖', '咖啡', '奶茶', '早餐', '午餐', '晚餐'],
      '交通': ['打车', '地铁', '公交', '加油', '停车'],
      '购物': ['买了', '购物', '衣服', '鞋子', '电子产品'],
      '娱乐': ['电影', 'KTV', '游戏', '旅游'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        entities.category = category;
        break;
      }
    }

    return entities;
  }

  /**
   * OCR识别
   */
  async processOcr(userId: string, dto: OcrRequestDto): Promise<OcrResponseDto> {
    const startTime = Date.now();
    
    try {
      this.logger.log(`开始OCR识别，用户ID: ${userId}, 类型: ${dto.type}`);

      // 构建OCR提示词
      const prompt = this.buildOcrPrompt(dto);

      // 调用AI进行OCR识别
      const aiResponse = await this.aiProvider.chat([
        {
          role: 'system',
          content: `你是一个专业的OCR识别助手，专门识别发票、收据等图片中的财务交易信息。
          你需要从图片中识别出：
          1. 交易金额和货币
          2. 商家或收款方名称
          3. 交易日期
          4. 商品或服务描述
          5. 其他相关信息（如地址、电话等）
          
          识别类型: ${dto.type}
          请以JSON格式返回识别结果。`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      // 解析OCR结果
      const result = this.parseOcrResponse(aiResponse, dto);

      // 记录处理时间
      const processingTime = Date.now() - startTime;
      result.processingTime = processingTime;

      this.logger.log(`OCR识别完成，处理时间: ${processingTime}ms, 置信度: ${result.confidence}`);

      return result;

    } catch (error) {
      this.logger.error(`OCR识别失败: ${error.message}`, error.stack);
      
      // 返回错误结果
      return {
        transaction: {
          amount: 0,
          merchant: '识别失败',
          description: error.message || 'OCR识别失败',
        },
        confidence: 0,
        rawText: '',
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * 构建OCR提示词
   */
  private buildOcrPrompt(dto: OcrRequestDto): string {
    const imageInfo = dto.image.length > 100 
      ? `${dto.image.substring(0, 100)}... (${dto.image.length} 字符)`
      : dto.image;

    return `
请分析以下图片，提取财务交易信息：

## 输入信息
- 图片数据: ${imageInfo}
- 识别类型: ${dto.type}

## 输出要求
返回JSON格式：
{
  "rawText": "识别出的完整文本",
  "transaction": {
    "amount": 金额数字,
    "currency": "货币代码（如CNY、USD）",
    "merchant": "商家名称",
    "description": "交易描述",
    "date": "交易日期（YYYY-MM-DD格式）",
    "items": ["商品1", "商品2"]
  },
  "confidence": 0.95,
  "metadata": {
    "address": "地址（如果有）",
    "phone": "电话（如果有）",
    "tax": "税额（如果有）"
  }
}

## 注意事项
1. 如果无法确定某些信息，对应字段可以为null或空字符串
2. 置信度要反映识别的确定性（0-1之间）
3. 金额要转换为数字格式
4. 日期要标准化为YYYY-MM-DD格式
5. 商家名称要提取完整
    `;
  }

  /**
   * 解析OCR响应
   */
  private parseOcrResponse(aiResponse: string, dto: OcrRequestDto): OcrResponseDto {
    try {
      // 尝试解析JSON响应
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // 处理 items，确保符合类型要求
        const items = parsed.transaction?.items || [];
        const processedItems = Array.isArray(items)
          ? items.map((item: any) => {
              if (typeof item === 'string') {
                return { name: item, price: 0 };
              } else if (item && typeof item === 'object') {
                return {
                  name: item.name || String(item),
                  price: item.price || 0,
                  quantity: item.quantity,
                };
              }
              return { name: String(item), price: 0 };
            })
          : [];

        return {
          transaction: {
            amount: parsed.transaction?.amount || 0,
            currency: parsed.transaction?.currency || 'CNY',
            merchant: parsed.transaction?.merchant || '未识别',
            description: parsed.transaction?.description || parsed.rawText || '',
            date: parsed.transaction?.date || undefined,
            items: processedItems,
          },
          confidence: parsed.confidence || 0.5,
          rawText: parsed.rawText || aiResponse,
          processingTime: 0, // 将在外部设置
        };
      }
    } catch (error) {
      this.logger.warn('OCR响应不是有效的JSON，使用文本分析');
    }

    // 如果AI没有返回JSON，使用文本分析
    const text = aiResponse;
    const confidence = this.estimateOcrConfidence(text);
    const transaction = this.extractTransactionFromText(text);

    return {
      transaction: {
        ...transaction,
        // 确保 items 符合类型要求（如果是字符串数组，需要转换）
        items: Array.isArray(transaction.items) 
          ? transaction.items.map((item: any) => 
              typeof item === 'string' 
                ? { name: item, price: 0 } 
                : item
            )
          : [],
      },
      confidence,
      rawText: text,
      processingTime: 0,
    };
  }

  /**
   * 估计OCR置信度
   */
  private estimateOcrConfidence(text: string): number {
    // 简单的置信度估计
    const hasAmount = /\d+(\.\d{1,2})?/.test(text);
    const hasMerchant = /(商店|超市|餐厅|公司|有限公司|店)/.test(text);
    const hasDate = /\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(text);
    
    let confidence = 0.3;
    if (hasAmount) confidence += 0.3;
    if (hasMerchant) confidence += 0.2;
    if (hasDate) confidence += 0.2;

    return Math.min(confidence, 0.95);
  }

  /**
   * 从文本中提取交易信息
   */
  private extractTransactionFromText(text: string): {
    amount: number;
    currency?: string;
    merchant?: string;
    description?: string;
    date?: string;
    items?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
  } {
    const transaction: {
      amount: number;
      currency?: string;
      merchant?: string;
      description?: string;
      date?: string;
      items?: Array<{
        name: string;
        price: number;
        quantity?: number;
      }>;
    } = {
      amount: 0,
      currency: 'CNY',
      merchant: '未识别',
      description: '',
      items: [],
    };

    // 提取金额
    const amountMatch = text.match(/(总计|合计|金额|￥|¥)\s*[:：]?\s*(\d+(\.\d{1,2})?)/);
    if (amountMatch) {
      transaction.amount = parseFloat(amountMatch[2]);
    }

    // 提取商家（简单关键词匹配）
    const merchantKeywords = ['商店', '超市', '餐厅', '公司', '有限公司', '店'];
    for (const keyword of merchantKeywords) {
      const index = text.indexOf(keyword);
      if (index !== -1) {
        // 提取商家名称（前后各20个字符）
        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + keyword.length + 20);
        transaction.merchant = text.substring(start, end).trim();
        break;
      }
    }

    // 提取日期
    const dateMatch = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (dateMatch) {
      transaction.date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
    } else {
      transaction.date = undefined;
    }

    // 提取描述（前100个字符）
    transaction.description = text.substring(0, 100).trim() || undefined;

    return transaction;
  }

  /**
   * 构建分类提示词
   */
  private buildClassificationPrompt(
    dto: ClassifyTransactionDto,
    categories: Array<{ id: string; name: string; type: any }>,
  ): string {
    const categoryList = categories
      .map((c) => `- ${c.name} (${c.type})`)
      .join('\n');

    return `请帮我分类以下交易：

描述：${dto.description || '无'}
金额：${dto.amount || '未知'}
地点：${dto.location || '未知'}
时间：${dto.time || '未知'}

可用的分类列表：
${categoryList}

请返回JSON格式：
{
  "primaryCategory": {
    "name": "分类名称",
    "confidence": 0.85,
    "reasoning": "分类理由"
  },
  "alternativeCategories": [
    {"name": "备选分类1", "confidence": 0.7}
  ],
  "extractedTags": ["标签1", "标签2"],
  "extractedEntities": {
    "merchant": "商户名称",
    "location": "地点",
    "time": "时间"
  }
}`;
  }

  /**
   * 解析分类响应
   */
  private parseClassificationResponse(
    aiResponse: string,
    categories: Array<{ id: string; name: string }>,
  ): ClassificationResponseDto {
    try {
      // 尝试解析JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const primaryCategory = categories.find(
          (c) => c.name === parsed.primaryCategory?.name,
        );

        return {
          primaryCategory: {
            id: primaryCategory?.id || '',
            name: parsed.primaryCategory?.name || '未分类',
            confidence: parsed.primaryCategory?.confidence || 0.5,
            reasoning: parsed.primaryCategory?.reasoning || '',
          },
          alternativeCategories:
            parsed.alternativeCategories?.map((alt: any) => {
              const cat = categories.find((c) => c.name === alt.name);
              return {
                id: cat?.id || '',
                name: alt.name || '',
                confidence: alt.confidence || 0.5,
              };
            }) || [],
          extractedTags: parsed.extractedTags || [],
          extractedEntities: parsed.extractedEntities || {},
        };
      }
    } catch (error) {
      this.logger.error(`解析分类响应失败: ${error}`);
    }

    // 默认返回
    return {
      primaryCategory: {
        id: '',
        name: '未分类',
        confidence: 0.5,
        reasoning: '无法解析AI响应',
      },
      alternativeCategories: [],
      extractedTags: [],
      extractedEntities: {},
    };
  }

  /**
   * 构建分析提示词
   */
  private buildAnalysisPrompt(
    transactions: any[],
    budgets: any[],
    analysisType: AnalysisType,
    focusAreas?: string[],
  ): string {
    const transactionSummary = transactions
      .slice(0, 50)
      .map(
        (t) =>
          `${t.category?.name || '未分类'} ${t.type} ¥${t.amount} ${t.description || ''}`,
      )
      .join('\n');

    return `请分析以下财务数据：

交易记录（最近50条）：
${transactionSummary}

预算情况：
${budgets.map((b) => `${b.name}: 预算¥${b.amount}, 已花费¥${b.spentAmount}`).join('\n')}

分析类型：${analysisType}
关注领域：${focusAreas?.join(', ') || '全部'}

请提供详细的分析报告，包括：
1. 财务摘要
2. 财务健康度评估
3. 关键洞察
4. 趋势分析
5. 改进建议`;
  }

  /**
   * 解析分析响应
   */
  private parseAnalysisResponse(
    aiResponse: string,
    transactions: any[],
    budgets: any[],
  ): AnalysisResponseDto {
    // 计算统计数据
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpense;
    const savingRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    const days = Math.ceil(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()) /
        (1000 * 60 * 60 * 24),
    ) || 1;

    // 计算财务健康度
    const healthScore = this.calculateHealthScore(
      totalIncome,
      totalExpense,
      budgets,
    );

    return {
      summary: {
        totalIncome,
        totalExpense,
        netSavings,
        savingRate: Math.round(savingRate * 100) / 100,
        averageDailySpending: totalExpense / days,
      },
      financialHealth: {
        score: healthScore,
        level: this.getHealthLevel(healthScore),
        breakdown: {
          spendingHabits: 70,
          savingRate: savingRate > 0 ? 80 : 40,
          budgetAdherence: 60,
          incomeStability: 75,
        },
        recommendations: this.extractRecommendations(aiResponse),
      },
      insights: this.extractInsights(aiResponse, transactions),
      trends: this.calculateTrends(transactions),
      recommendations: this.extractDetailedRecommendations(aiResponse, transactions),
    };
  }

  /**
   * 计算财务健康度
   */
  private calculateHealthScore(
    totalIncome: number,
    totalExpense: number,
    budgets: any[],
  ): number {
    let score = 50;

    // 储蓄率评分
    if (totalIncome > 0) {
      const savingRate = ((totalIncome - totalExpense) / totalIncome) * 100;
      if (savingRate > 30) score += 20;
      else if (savingRate > 20) score += 15;
      else if (savingRate > 10) score += 10;
      else if (savingRate < 0) score -= 20;
    }

    // 预算执行评分
    const budgetAdherence = budgets.length > 0
      ? budgets.filter((b) => b.spentAmount <= b.amount).length /
        budgets.length
      : 0.5;
    score += budgetAdherence * 20;

    // 支出稳定性（简化计算）
    score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 获取健康度等级
   */
  private getHealthLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'poor';
    return 'critical';
  }

  /**
   * 提取建议
   */
  private extractRecommendations(aiResponse: string): string[] {
    const recommendations: string[] = [];
    
    // 从AI响应中提取建议
    const lines = aiResponse.split('\n');
    lines.forEach((line) => {
      if (line.includes('建议') || line.includes('建议')) {
        const match = line.match(/\d+\.\s*(.+)/);
        if (match) {
          recommendations.push(match[1].trim());
        }
      }
    });

    // 如果没有提取到，返回默认建议
    if (recommendations.length === 0) {
      return [
        '建议控制非必要支出',
        '增加储蓄率',
        '设置预算提醒',
      ];
    }

    return recommendations.slice(0, 5);
  }

  /**
   * 提取洞察
   */
  private extractInsights(aiResponse: string, transactions: any[]): Array<{
    type: 'positive' | 'warning' | 'critical';
    title: string;
    description: string;
    data: any;
    recommendation?: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    const insights: Array<{
      type: 'positive' | 'warning' | 'critical';
      title: string;
      description: string;
      data: any;
      recommendation?: string;
      priority: 'low' | 'medium' | 'high';
    }> = [];

    // 分析交易数据生成洞察
    const expenseTransactions = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE,
    );
    
    if (expenseTransactions.length > 0) {
      const avgExpense = expenseTransactions.reduce(
        (sum, t) => sum + t.amount.toNumber(),
        0,
      ) / expenseTransactions.length;

      insights.push({
        type: avgExpense > 500 ? 'warning' : 'positive',
        title: '平均支出分析',
        description: `平均每笔支出为¥${avgExpense.toFixed(2)}`,
        data: { averageExpense: avgExpense },
        priority: 'medium',
      });
    }

    return insights;
  }

  /**
   * 计算趋势
   */
  private calculateTrends(transactions: any[]): {
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
  } {
    const spendingByCategory: Record<string, number> = {};
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (t.type === TransactionType.INCOME) {
        monthlyData[month].income += t.amount;
      } else if (t.type === TransactionType.EXPENSE) {
        monthlyData[month].expense += t.amount;
        const categoryName = t.category?.name || '未分类';
        spendingByCategory[categoryName] =
          (spendingByCategory[categoryName] || 0) + t.amount;
      }
    });

    return {
      spendingByCategory,
      monthlyComparison: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        difference: data.income - data.expense,
      })),
      topSpendingDays: transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map((t) => ({
          date: new Date(t.transactionDate).toISOString().split('T')[0],
          amount: t.amount,
          category: t.category?.name || '未分类',
        })),
    };
  }

  /**
   * 提取建议操作
   */
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    if (response.includes('分类')) {
      suggestions.push('查看分类管理');
    }
    if (response.includes('预算')) {
      suggestions.push('查看预算设置');
    }
    if (response.includes('支出')) {
      suggestions.push('查看交易记录');
    }

    return suggestions;
  }

  /**
   * 提取详细建议
   */
  private extractDetailedRecommendations(
    aiResponse: string,
    transactions: any[],
  ): Array<{
    category: string;
    currentSpending: number;
    suggestedSpending: number;
    potentialSavings: number;
    actionSteps: string[];
    expectedImpact: string;
  }> {
    const recommendations: Array<{
      category: string;
      currentSpending: number;
      suggestedSpending: number;
      potentialSavings: number;
      actionSteps: string[];
      expectedImpact: string;
    }> = [];

    // 简化实现：基于交易数据生成建议
    const categorySpending: Record<string, number> = {};
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        const categoryName = t.category?.name || '未分类';
        categorySpending[categoryName] =
          (categorySpending[categoryName] || 0) + t.amount;
      });

    Object.entries(categorySpending).forEach(([category, spending]) => {
      if (spending > 1000) {
        recommendations.push({
          category,
          currentSpending: spending,
          suggestedSpending: spending * 0.8,
          potentialSavings: spending * 0.2,
          actionSteps: ['减少该分类的支出', '寻找更优惠的替代方案'],
          expectedImpact: `预计可节省¥${(spending * 0.2).toFixed(2)}`,
        });
      }
    });

    return recommendations.slice(0, 5);
  }
}
