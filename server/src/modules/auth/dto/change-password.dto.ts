import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '当前密码',
    example: 'oldpassword123',
  })
  @IsString()
  @IsNotEmpty({ message: '当前密码不能为空' })
  currentPassword: string;

  @ApiProperty({
    description: '新密码',
    example: 'newpassword123',
    minLength: 6,
    maxLength: 32,
  })
  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  @MaxLength(32, { message: '密码最多32个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  newPassword: string;

  @ApiProperty({
    description: '确认新密码',
    example: 'newpassword123',
  })
  @IsString()
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;
}
