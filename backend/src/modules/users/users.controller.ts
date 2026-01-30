import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  
  @Get('me')
  async getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  
  @Patch('me')
  async updateProfile(

    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
   
    return this.usersService.updateProfile(
      req.user.userId,
      updateUserDto,
    );
  }
  
  
  @Patch('change-password')
  async changePassword(
    @Req() req,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      req.user.userId,
      dto,
    );

    return { message: 'Password updated successfully' };
  }

 
  @Get('orders')
  async getOrderHistory(@Req() req) {
    return this.usersService.getOrderHistory(req.user.userId);
  }

  
  @Delete('me')
  async deleteAccount(@Req() req) {
    await this.usersService.deleteAccount(req.user.userId);
    return { message: 'Account deleted successfully' };
  }
}
