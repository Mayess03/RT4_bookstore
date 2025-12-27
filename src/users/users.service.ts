import {
  Injectable,
  NotFoundException,
   UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
 
  // FIND METHODS
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }
 findAll(): Promise<User[]> {
     return this.userRepository.find();
}


  // CREATE USER (SAVE DIRECT)
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role ?? Role.USER,
      isActive: true,
    });
  }

  // USER-01 : UPDATE PROFILE (PRELOAD)
  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: userId,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.save(user);
  }
  
  // USER-02 : CHANGE / RESET PASSWORD (PRELOAD)
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!isValid) {
throw new UnauthorizedException('Wrong password');      }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    const updatedUser = await this.userRepository.preload({
      id: userId,
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.save(updatedUser);
  }

  // USER-04 : ORDER HISTORY (STUB)
  async getOrderHistory(userId: string) {
    return {
      message:
        'Order history will be available when OrdersModule is implemented',
    };
  }


async resetPasswordById(
  userId: string,
  newHashedPassword: string,
): Promise<void> {
  const user = await this.userRepository.preload({
    id: userId,
    password: newHashedPassword,
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepository.save(user);
}
 // delete account
  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(userId);
  }
 
  // EMAIL VERIFICATION
  async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isActive: true,
    });
  }
}
