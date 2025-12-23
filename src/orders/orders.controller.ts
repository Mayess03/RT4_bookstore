import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

// ⚠️ supposé existant
import { FakeJwtAuthGuard } from '../common/entities/guards/fake-jwt-auth.guard';

@Controller('orders')
@UseGuards(FakeJwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ORDER-01
  @Post()
  createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  // ORDER-05
  @Get('my')
  findMyOrders(@Req() req) {
    return this.ordersService.findMyOrders(req.user.id);
  }

  // ORDER-06
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.ordersService.findOne(Number(id), req.user.id);
  }
}
