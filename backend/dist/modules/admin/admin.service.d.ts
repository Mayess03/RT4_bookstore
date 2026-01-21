import { UsersService } from '../users/users.service';
export declare class AdminService {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllUsers(): Promise<import("../../database/entities").User[]>;
    findUserById(userId: string): Promise<import("../../database/entities").User>;
    toggleUserStatus(userId: string): Promise<import("../../database/entities").User>;
    deleteUser(userId: string): Promise<void>;
}
