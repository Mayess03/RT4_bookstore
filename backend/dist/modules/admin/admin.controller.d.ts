import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    findAllUsers(): Promise<import("../../database/entities").User[]>;
    findUser(id: string): Promise<import("../../database/entities").User>;
    toggleUser(id: string): Promise<import("../../database/entities").User>;
    deleteUser(id: string): Promise<void>;
}
