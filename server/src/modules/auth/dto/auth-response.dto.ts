import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '令牌类型',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: '过期时间（秒）',
    example: 604800,
  })
  expiresIn: number;

  @ApiProperty({
    description: '用户信息',
  })
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
  };
}
