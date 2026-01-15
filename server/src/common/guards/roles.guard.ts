import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 暂时允许所有请求通过，后续实现角色验证
    return true;
  }
}
