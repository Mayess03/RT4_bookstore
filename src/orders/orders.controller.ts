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
import { Query, Patch } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FakeAdminGuard } from '../common/entities/guards/fake-admin.guard';
import { OrderStatus } from './entities/order-status.enum';


// ⚠️ supposé existant
import { FakeJwtAuthGuard } from '../common/entities/guards/fake-jwt-auth.guard';

@Controller('orders')
@UseGuards(FakeJwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(FakeAdminGuard)
@Get('admin')
findAllOrders(
  @Query('status') status?: OrderStatus,
  @Query('userId') userId?: string,
) {
  return this.ordersService.findAll(
    status,
    userId ? Number(userId) : undefined,
  );
}

@UseGuards(FakeAdminGuard)
@Patch('admin/:id/status')
updateOrderStatus(
  @Param('id') id: number,
  @Body() dto: UpdateStatusDto,
) {
  return this.ordersService.updateStatus(Number(id), dto.status);
}

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
  // ORDER-04 : confirmer commande
  @UseGuards(FakeJwtAuthGuard)
  @Patch(':id/confirm')
  confirmOrder(@Param('id') id: string) {
    const userId = 1; // 🔴 mock user
    return this.ordersService.confirmOrder(+id, userId);
  }

  // ORDER-06
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.ordersService.findOne(Number(id), req.user.id);
  }
  
// ORDER-07 : suivre le statut
  @Get(':id/status')
  getOrderStatus(@Param('id') id: string) {
    const userId = 1; // 🔴 MOCK USER
    return this.ordersService.getOrderStatus(+id, userId);
  }
  // ORDER-08 : annuler commande
@UseGuards(FakeJwtAuthGuard)
@Patch(':id/cancel')
cancelOrder(@Param('id') id: string) {
  const userId = 1; // 🔴 mock user
  return this.ordersService.cancelOrder(+id, userId);
}

  
}



