import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Book, Order } from '../../database/entities';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, Order])],
  controllers: [StatsController],
  providers: [StatsService, OrdersGateway],
})
export class StatsModule {}

