export interface RegisterDto {
  email: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
  name: string;
  verificationCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
    createdAt?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferredCurrency: string;
  timezone: string;
  language: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
