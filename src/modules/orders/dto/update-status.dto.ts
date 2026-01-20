import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../common/enums';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
