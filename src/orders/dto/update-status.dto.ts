import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order-status.enum';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
