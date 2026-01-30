import {
  Injectable,
  NotFoundException,
   UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

import { User } from '../../database/entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrdersService } from '../orders/orders.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
      private readonly ordersService: OrdersService,

    
  ) {}
 

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

 
async getOrderHistory(userId: string) {
  return this.ordersService.findMyOrders(userId);
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

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(userId);
  }
 
  
  async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isActive: true,
    });
  }
}
