import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AdminService } from './admin.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../common/enum/role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), new RolesGuard(Role.ADMIN))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ADMIN-01 : LIST USERS
  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  // ADMIN-03 : USER DETAILS
  @Get('users/:id')
  findUser(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  // ADMIN-02 : BLOCK / UNBLOCK
  @Patch('users/:id/toggle')
  toggleUser(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  // ADMIN-04 : DELETE USER
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
