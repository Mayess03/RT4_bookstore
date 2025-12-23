import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // utile plus tard (optionnel mais propre)
})
export class OrdersModule {}
