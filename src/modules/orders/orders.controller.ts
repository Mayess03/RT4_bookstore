import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderStatus } from '../../common/enums';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // ================= ADMIN =================

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: string,
  ) {
    return this.ordersService.findAll(status, userId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('admin/:id/refund')
  refund(@Param('id') id: string) {
    return this.ordersService.refundOrder(id);
  }



  // ================= USER =================

  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @Req() req) {
    return this.ordersService.confirmOrder(id, req.user.userId);
  }

  @Get('my')
  findMy(@Req() req) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.findUserOrder(id, req.user.userId);
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string, @Req() req) {
    return this.ordersService.getStatus(id, req.user.userId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Req() req) {
    return this.ordersService.cancelOrder(id, req.user.userId);
  }

  
}
