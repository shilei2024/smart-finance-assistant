import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export enum SpeechLanguage {
  ZH_CN = 'zh-CN', // 中文（简体）
  ZH_TW = 'zh-TW', // 中文（繁体）
  EN_US = 'en-US', // 英语（美国）
  JA_JP = 'ja-JP', // 日语
  KO_KR = 'ko-KR', // 韩语
}

export class SpeechRequestDto {
  @ApiProperty({
    description: '音频文件URL或Base64编码的音频数据',
    example: 'https://example.com/audio.wav',
  })
  @IsString()
  @IsNotEmpty({ message: '音频数据不能为空' })
  audio: string;

  @ApiProperty({
    description: '音频格式',
    example: 'wav',
    required: false,
  })
  @IsOptional()
  @IsString()
  format?: string = 'wav';

  @ApiProperty({
    description: '语言代码',
    enum: SpeechLanguage,
    example: SpeechLanguage.ZH_CN,
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: SpeechLanguage = SpeechLanguage.ZH_CN;

  @ApiProperty({
    description: '置信度阈值（0-1）',
    example: 0.7,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceThreshold?: number = 0.7;
}

export class SpeechResponseDto {
  @ApiProperty({
    description: '识别出的文本',
    example: '今天在星巴克消费了35元',
  })
  text: string;

  @ApiProperty({
    description: '置信度（0-1）',
    example: 0.85,
  })
  confidence: number;

  @ApiProperty({
    description: '识别的语言',
    example: 'zh-CN',
  })
  language: string;

  @ApiProperty({
    description: '识别的实体（金额、商家等）',
    example: {
      amount: 35,
      currency: 'CNY',
      merchant: '星巴克',
      category: '餐饮',
    },
    required: false,
  })
  entities?: Record<string, any>;

  @ApiProperty({
    description: '处理时间（毫秒）',
    example: 1200,
  })
  processingTime: number;
}
