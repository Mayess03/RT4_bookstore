import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(createCartItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('item')
  updateItem(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateItemQuantity(updateCartItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item')
  removeItem(@Query('userId') userId: string, @Query('bookId') bookId: string) {
    return this.cartService.removeItem(userId, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/total')
  calculateTotal(@Param('userId') userId: string, @Query('tax') tax?: string) {
    const taxRate = tax ? Number(tax) : 0;
    return this.cartService.calculateTotal(userId, taxRate);
  }
}
