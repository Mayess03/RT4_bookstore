import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtRefreshPayload } from '../interfaces/jwt-refresh-payload.interface';
import { JwtRefreshUser } from '../interfaces/jwt-refresh-user.interface';
declare const RefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshStrategy extends RefreshStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtRefreshPayload): Promise<JwtRefreshUser>;
}
export {};
