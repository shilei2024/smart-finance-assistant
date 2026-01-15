import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';

export class AiChatDto {
  @ApiProperty({
    description: '用户消息',
    example: '我这个月花了多少钱？',
  })
  @IsString()
  @IsNotEmpty({ message: '消息内容不能为空' })
  message: string;

  @ApiProperty({
    description: '对话历史',
    example: [],
    required: false,
  })
  @IsOptional()
  @IsArray()
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
