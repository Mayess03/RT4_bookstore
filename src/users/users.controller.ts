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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt')) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // USER-01 : GET PROFILE
  @Get('me')
  async getProfile(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  // USER-01 : UPDATE PROFILE
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
  
  // USER-02 : CHANGE PASSWORD
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

  // USER-04 : ORDER HISTORY (STUB)
  @Get('orders')
  async getOrderHistory(@Req() req) {
    return this.usersService.getOrderHistory(req.user.userId);
  }

  // USER-05 : DELETE ACCOUNT
  @Delete('me')
  async deleteAccount(@Req() req) {
    await this.usersService.deleteAccount(req.user.userId);
    return { message: 'Account deleted successfully' };
  }
}
