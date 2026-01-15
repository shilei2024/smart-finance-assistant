import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum OcrType {
  RECEIPT = 'RECEIPT',
  INVOICE = 'INVOICE',
  BILL = 'BILL',
}

export class OcrRequestDto {
  @ApiProperty({
    description: '图片URL或Base64',
    example: 'https://example.com/receipt.jpg',
  })
  @IsString()
  @IsNotEmpty({ message: '图片不能为空' })
  image: string;

  @ApiProperty({
    description: 'OCR类型',
    enum: OcrType,
    example: OcrType.RECEIPT,
    required: false,
  })
  @IsOptional()
  @IsEnum(OcrType)
  type?: OcrType = OcrType.RECEIPT;
}
