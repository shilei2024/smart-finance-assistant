import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions');
    this.model = this.configService.get<string>('DEEPSEEK_MODEL', 'deepseek-chat');
  }

  /**
   * 调用AI API
   */
  async chat(messages: AiMessage[]): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('AI API Key未配置，返回模拟响应');
      return this.getMockResponse(messages);
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      return response.data.choices[0]?.message?.content || '抱歉，无法生成回复';
    } catch (error: any) {
      this.logger.error(`AI API调用失败: ${error.message}`);
      return this.getMockResponse(messages);
    }
  }

  /**
   * 获取模拟响应（用于开发和测试）
   */
  private getMockResponse(messages: AiMessage[]): string {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (lastMessage.includes('分类') || lastMessage.includes('category')) {
      return '根据您的描述，建议分类为"餐饮"，置信度85%。';
    }
    
    if (lastMessage.includes('分析') || lastMessage.includes('分析')) {
      return '根据您的交易记录分析，本月总支出较上月增长10%，建议关注餐饮和交通支出。';
    }
    
    if (lastMessage.includes('建议') || lastMessage.includes('建议')) {
      return '建议您：1. 控制餐饮支出 2. 增加储蓄率 3. 设置预算提醒';
    }
    
    return '我是您的智能记账助手，可以帮助您分析财务状况、分类交易、提供建议等。请告诉我您需要什么帮助？';
  }
}
