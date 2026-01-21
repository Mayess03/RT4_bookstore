import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { OrderStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartItem } from '../../database/entities/cart-item.entity';
import { CartService } from '../cart/cart.service';
import { BooksService } from '../books/books.service';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly cartService: CartService,   // ✅
    private readonly booksService: BooksService, // ✅
    
  ) {}
  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
  // 1️⃣ récupérer panier
  const cart = await this.cartService.getCart(userId);

  if (!cart || cart.items.length === 0) {
    throw new BadRequestException('Cart is empty');
  }

  let totalPrice = 0;

  // 2️⃣ créer commande
  const order = this.orderRepo.create({
    userId,
    status: OrderStatus.PENDING,
    shippingAddress: dto.shippingAddress,
    shippingCity: dto.shippingCity,
    shippingZipCode: dto.shippingZipCode,
    phone: dto.phone,
    totalPrice: 0,
  });

  const savedOrder = await this.orderRepo.save(order);

  // 3️⃣ items
  const orderItems: OrderItem[] = [];

  for (const item of cart.items) {
    const book = await this.booksService.findOne(item.bookId);

    if (book.stock < item.quantity) {
      throw new BadRequestException(`Stock insuffisant pour ${book.title}`);
    }

    const subtotal = book.price * item.quantity;
    totalPrice += subtotal;

    orderItems.push(
      this.orderItemRepo.create({
        order: savedOrder,
        bookId: book.id,
        quantity: item.quantity,
        unitPrice: book.price,
        subtotal,
      }),
    );

    await this.booksService.decreaseStock(book.id, item.quantity);
  }

  await this.orderItemRepo.save(orderItems);

  savedOrder.totalPrice = totalPrice;
  await this.orderRepo.save(savedOrder);

  // 4️⃣ vider panier
  await this.cartService.clearCart(userId);

  return savedOrder;
}



  // ================= USER =================

  // ORDER-01
 /* async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    // 🔴 PANIER MOCK
    const cartItems = [
      { bookId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', quantity: 2, unitPrice: 30 },
      { bookId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1, unitPrice: 50 },
    ];

    const totalPrice = cartItems.reduce(

      (sum, i) => sum + i.quantity * i.unitPrice,
      0,
    );

    const order = this.orderRepo.create({
      userId,
      totalPrice,
      status: OrderStatus.PENDING,
      shippingAddress: dto.shippingAddress,
      shippingCity: dto.shippingCity,
      shippingZipCode: dto.shippingZipCode,
      phone: dto.phone,
    });

    const savedOrder = await this.orderRepo.save(order);

    const items = cartItems.map((item) =>
      this.orderItemRepo.create({
        order: savedOrder,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
      }),
    );

    await this.orderItemRepo.save(items);
    return savedOrder;
  }
  */
 

  // ORDER-04
  async confirmOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findUserOrder(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be confirmed');
    }

    order.status = OrderStatus.CONFIRMED;
    return this.orderRepo.save(order);
  }

  // ORDER-05
  async findMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  // ORDER-06
  async findUserOrder(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId)
      throw new ForbiddenException('Access denied');

    return order;
  }

  // ORDER-07
  async getStatus(id: string, userId: string): Promise<OrderStatus> {
    const order = await this.findUserOrder(id, userId);
    return order.status;
  }

  // ORDER-08
  async cancelOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findUserOrder(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only PENDING orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepo.save(order);
  }

  // ================= ADMIN =================

  // ORDER-10 / ORDER-11
  async findAll(
    status?: OrderStatus,
    userId?: string,
  ): Promise<Order[]> {
    const query = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    return query.getMany();
  }

  // ORDER-12
  async findOneAdmin(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ORDER-13
  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.findOneAdmin(id);
    order.status = status;
    return this.orderRepo.save(order);
  }

  // ORDER-14
  async refundOrder(id: string): Promise<Order> {
    const order = await this.findOneAdmin(id);

    order.status = OrderStatus.CANCELLED;
    // 💸 remboursement simulé ici
    return this.orderRepo.save(order);
  }
}
