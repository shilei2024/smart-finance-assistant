import axiosInstance from './axios.config';
import type {
  ClassifyTransactionDto,
  ClassificationResponseDto,
  AiAnalysisDto,
  AnalysisResponseDto,
  AiChatDto,
  ChatResponseDto,
  OcrRequestDto,
  OcrResponseDto,
} from '../types/ai';

export const aiAPI = {
  /**
   * 分类交易
   */
  async classifyTransaction(
    data: ClassifyTransactionDto,
  ): Promise<ClassificationResponseDto> {
    const response: any = await axiosInstance.post('/ai/classify', data);
    return response.data || response;
  },

  /**
   * 生成财务分析
   */
  async generateAnalysis(data: AiAnalysisDto): Promise<AnalysisResponseDto> {
    const response: any = await axiosInstance.post('/ai/analyze', data);
    return response.data || response;
  },

  /**
   * AI对话
   */
  async chat(data: AiChatDto): Promise<ChatResponseDto> {
    const response: any = await axiosInstance.post('/ai/chat', data);
    return response.data || response;
  },

  /**
   * OCR识别
   */
  async processOcr(data: OcrRequestDto): Promise<OcrResponseDto> {
    const response: any = await axiosInstance.post('/ai/ocr', data);
    return response.data || response;
  },
};
