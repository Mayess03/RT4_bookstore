import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class FakeAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
