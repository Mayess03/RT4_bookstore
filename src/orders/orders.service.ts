import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './entities/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  // ORDER-01 : créer une commande
  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    // 🔴 PANIER MOCK
    const cartItems = [
      { bookId: 1, quantity: 2, unitPrice: 30 },
      { bookId: 3, quantity: 1, unitPrice: 45 },
    ];

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const order = this.orderRepo.create({
      userId,
      totalPrice,
      status: OrderStatus.PENDING,
      shippingAddress: dto.shippingAddress,
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems = cartItems.map((item) =>
      this.orderItemRepo.create({
        order: savedOrder,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }),
    );

    await this.orderItemRepo.save(orderItems);

    return savedOrder;
  }

  // ORDER-05 : historique user
  async findMyOrders(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
    });
  }

  // ORDER-06 : détail sécurisé
  async findOne(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }
}
