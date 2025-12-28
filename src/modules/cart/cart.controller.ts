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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add a book to cart
  @UseGuards(JwtAuthGuard)
  @Post('add')
  addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(createCartItemDto);
  }

  // Update cart item quantity
  @UseGuards(JwtAuthGuard)
  @Patch('item')
  updateItem(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateItemQuantity(updateCartItemDto);
  }

  // Remove an item from cart
  @UseGuards(JwtAuthGuard)
  @Delete('item')
  removeItem(@Query('userId') userId: string, @Query('bookId') bookId: string) {
    return this.cartService.removeItem(userId, bookId);
  }

  // Get cart for a user
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  // Clear cart
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  // Calculate total with optional tax query param (e.g., ?tax=0.2)
  @UseGuards(JwtAuthGuard)
  @Get(':userId/total')
  calculateTotal(@Param('userId') userId: string, @Query('tax') tax?: string) {
    const taxRate = tax ? Number(tax) : 0;
    return this.cartService.calculateTotal(userId, taxRate);
  }
}
