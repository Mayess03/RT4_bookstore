import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  
    async findAllUsers() {
    return this.usersService.findAll();
  }

  
  async findUserById(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
 
  async toggleUserStatus(userId: string) {
    const user = await this.findUserById(userId);

    user.isActive = !user.isActive;

    return this.usersService['userRepository'].save(user);
  }

  async deleteUser(userId: string) {
    return this.usersService.deleteAccount(userId);
  }
}
