import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingZipCode: string;

  @IsString()
  phone: string;
}
