import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class FakeJwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
