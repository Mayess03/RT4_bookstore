import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
    }>;
    logout(): {
        message: string;
    };
    forgot(dto: ForgotPasswordDto): Promise<{
        message: string;
    } | undefined>;
    reset(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
