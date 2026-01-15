import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: '邮箱地址',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '手机号',
    example: '13800138000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号（11位数字，以1开头）' })
  phone?: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
    minLength: 6,
    maxLength: 32,
  })
  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  @MaxLength(32, { message: '密码最多32个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  password: string;

  @ApiProperty({
    description: '确认密码',
    example: 'password123',
  })
  @IsString()
  passwordConfirm: string;

  @ApiProperty({
    description: '姓名',
    example: '张三',
    minLength: 2,
    maxLength: 32,
  })
  @IsString()
  @MinLength(2, { message: '姓名至少2个字符' })
  @MaxLength(32, { message: '姓名最多32个字符' })
  name: string;

  @ApiProperty({
    description: '验证码',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  verificationCode?: string;
}
