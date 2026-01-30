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
import { OrdersGateway } from '../stats/orders.gateway';


@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersGateway: OrdersGateway,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly cartService: CartService,   
    private readonly booksService: BooksService, 

  ) { }
  async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
    
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalPrice = 0;

   
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

    //vider le panier 
    await this.cartService.clearCart(userId);
    this.ordersGateway.newOrder(savedOrder);

    return savedOrder;
  }



  


  
  async confirmOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findUserOrder(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be confirmed');
    }

    order.status = OrderStatus.CONFIRMED;
    return this.orderRepo.save(order);
  }

  
  async findMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  
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

  
  async getStatus(id: string, userId: string): Promise<OrderStatus> {
    const order = await this.findUserOrder(id, userId);
    return order.status;
  }

  
  async cancelOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findUserOrder(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only PENDING orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepo.save(order);
  }

  // ================= ADMIN =================

  
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

 
  async findOneAdmin(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  
  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.findOneAdmin(id);
    order.status = status;
    return this.orderRepo.save(order);
  }

  
  async refundOrder(id: string): Promise<Order> {
    const order = await this.findOneAdmin(id);

    order.status = OrderStatus.CANCELLED;
    // remboursement simulé ici
    return this.orderRepo.save(order);
  }
}
