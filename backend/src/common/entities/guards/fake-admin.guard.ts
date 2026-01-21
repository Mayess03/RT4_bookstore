import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class FakeAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // 🔴 ADMIN MOCK
    req.user = {
      id: 99,
      role: 'ADMIN',
    };

    return true;
  }
}
