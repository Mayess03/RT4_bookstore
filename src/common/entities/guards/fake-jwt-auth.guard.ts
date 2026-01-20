import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class FakeJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // 🔴 USER MOCK
    req.user = {
      id: 1,
      role: 'USER',
    };

    return true;
  }
}
