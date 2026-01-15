import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ClassifyTransactionDto } from './dto/classify-transaction.dto';
import { AiAnalysisDto } from './dto/ai-analysis.dto';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('classify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分类交易', description: '使用AI自动分类交易' })
  @ApiResponse({
    status: 200,
    description: '分类成功',
    type: ClassificationResponseDto,
  })
  async classifyTransaction(
    @CurrentUser() user: any,
    @Body() dto: ClassifyTransactionDto,
  ): Promise<ClassificationResponseDto> {
    return this.aiService.classifyTransaction(user.id, dto);
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '财务分析', description: '使用AI生成财务分析报告' })
  @ApiResponse({
    status: 200,
    description: '分析成功',
    type: AnalysisResponseDto,
  })
  async generateAnalysis(
    @CurrentUser() user: any,
    @Body() dto: AiAnalysisDto,
  ): Promise<AnalysisResponseDto> {
    return this.aiService.generateAnalysis(user.id, dto);
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI对话', description: '与AI助手对话' })
  @ApiResponse({
    status: 200,
    description: '对话成功',
    type: ChatResponseDto,
  })
  async chat(
    @CurrentUser() user: any,
    @Body() dto: AiChatDto,
  ): Promise<ChatResponseDto> {
    return this.aiService.chat(user.id, dto);
  }

  @Post('ocr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'OCR识别', description: '识别发票或收据' })
  @ApiResponse({
    status: 200,
    description: '识别成功',
    type: OcrResponseDto,
  })
  async processOcr(
    @CurrentUser() user: any,
    @Body() dto: OcrRequestDto,
  ): Promise<OcrResponseDto> {
    return this.aiService.processOcr(user.id, dto);
  }

  @Post('speech')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '语音识别', description: '识别语音中的交易信息' })
  @ApiResponse({
    status: 200,
    description: '识别成功',
    type: SpeechResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  async recognizeSpeech(
    @CurrentUser() user: any,
    @Body() dto: SpeechRequestDto,
  ): Promise<SpeechResponseDto> {
    return this.aiService.recognizeSpeech(user.id, dto);
  }
}
