import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CartModule } from '../cart/cart.module';
import { BooksModule } from '../books/books.module';
import { OrdersGateway } from '../stats/orders.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule, // ✅
    BooksModule, // ✅ (si stock/prix)  
  ],
  controllers: [OrdersController],
  providers: [OrdersService,
    OrdersGateway
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
