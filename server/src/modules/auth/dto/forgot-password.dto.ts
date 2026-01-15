import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: '邮箱地址',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;
}
