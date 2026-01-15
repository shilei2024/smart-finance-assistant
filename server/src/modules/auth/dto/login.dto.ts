import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '邮箱地址',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  password: string;

  @ApiProperty({
    description: '记住我',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'rememberMe 必须是布尔值' })
  rememberMe?: boolean;
}
