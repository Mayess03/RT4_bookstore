import { Book } from './book.model';
import { User } from './user.model';

/**
 * Order Status - All possible states of an order
 *
 * Enum = Predefined set of values
 * Better than strings because TypeScript catches typos
 */
export enum OrderStatus {
  PENDING = 'PENDING',       // Order created, awaiting payment
  PROCESSING = 'PROCESSING', // Payment confirmed, preparing shipment
  SHIPPED = 'SHIPPED',       // Package shipped
  DELIVERED = 'DELIVERED',   // Customer received it
  CANCELLED = 'CANCELLED',   // Order cancelled
  REFUNDED = 'REFUNDED'      // Money refunded
}

/**
 * Order Item - One item in an order (like CartItem but final)
 */
export interface OrderItem {
  id: string;
  orderId: string;
  bookId: string;
  book?: Book;
  quantity: number;
  unitPrice: number;   // converted from API string
  subtotal: number;    // converted from API string
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalPrice: number;      // converted from API string
  status: OrderStatus;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZipCode?: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}


/**
 * Create Order DTO - What we SEND to create an order
 */
export interface CreateOrderDto {
  shippingAddress?: string;
}

/**
 * Update Order Status DTO - What admin SENDS to change status
 */
export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
