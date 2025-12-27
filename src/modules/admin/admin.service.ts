import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  // ADMIN-01 : LIST USERS
    async findAllUsers() {
    return this.usersService.findAll();
  }

  // ADMIN-03 : GET USER DETAILS
  async findUserById(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  // ADMIN-02 : BLOCK / UNBLOCK
  async toggleUserStatus(userId: string) {
    const user = await this.findUserById(userId);

    user.isActive = !user.isActive;

    return this.usersService['userRepository'].save(user);
  }

  // ADMIN-04 : DELETE USER
  async deleteUser(userId: string) {
    return this.usersService.deleteAccount(userId);
  }
}
