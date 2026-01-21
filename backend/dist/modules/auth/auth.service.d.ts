import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CartService } from '../cart/cart.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwt;
    private readonly cartService;
    constructor(usersService: UsersService, jwt: JwtService, cartService: CartService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(userId: string): Promise<{
        accessToken: string;
    }>;
    logout(): {
        message: string;
    };
    forgotPassword(email: string): Promise<{
        message: string;
    } | undefined>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
