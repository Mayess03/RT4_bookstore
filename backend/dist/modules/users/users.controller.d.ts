import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("../../database/entities").User | null>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("../../database/entities").User>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getOrderHistory(req: any): Promise<import("../../database/entities").Order[]>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
