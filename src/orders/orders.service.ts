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
  // ORDER-07 : suivre le statut
async getOrderStatus(
  orderId: number,
  userId: number,
): Promise<{ status: OrderStatus }> {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  return { status: order.status };
}

  // ORDER-10 + ORDER-11
async findAll(
  status?: OrderStatus,
  userId?: number,
): Promise<Order[]> {
  const query = this.orderRepo.createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'items');

  if (status) {
    query.andWhere('order.status = :status', { status });
  }

  if (userId) {
    query.andWhere('order.userId = :userId', { userId });
  }

  return query.getMany();
}

// ORDER-13
async updateStatus(
  orderId: number,
  status: OrderStatus,
): Promise<Order> {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  order.status = status;
  return this.orderRepo.save(order);
}

// ORDER-04 : confirmer une commande (USER)
async confirmOrder(orderId: number, userId: number): Promise<Order> {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new ForbiddenException(
      'Only pending orders can be confirmed',
    );
  }

  // 💳 Paiement simulé
  order.status = OrderStatus.CONFIRMED;

  return this.orderRepo.save(order);
}
// ORDER-08 : annuler une commande (USER)
async cancelOrder(orderId: number, userId: number): Promise<Order> {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.userId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new ForbiddenException(
      'Only pending orders can be cancelled',
    );
  }

  order.status = OrderStatus.CANCELLED;

  return this.orderRepo.save(order);
}

}
