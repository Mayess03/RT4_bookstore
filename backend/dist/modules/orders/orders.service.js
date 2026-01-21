"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../database/entities/order.entity");
const order_item_entity_1 = require("../../database/entities/order-item.entity");
const enums_1 = require("../../common/enums");
const cart_service_1 = require("../cart/cart.service");
const books_service_1 = require("../books/books.service");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    cartService;
    booksService;
    constructor(orderRepo, orderItemRepo, cartService, booksService) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartService = cartService;
        this.booksService = booksService;
    }
    async createOrder(userId, dto) {
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let totalPrice = 0;
        const order = this.orderRepo.create({
            userId,
            status: enums_1.OrderStatus.PENDING,
            shippingAddress: dto.shippingAddress,
            shippingCity: dto.shippingCity,
            shippingZipCode: dto.shippingZipCode,
            phone: dto.phone,
            totalPrice: 0,
        });
        const savedOrder = await this.orderRepo.save(order);
        const orderItems = [];
        for (const item of cart.items) {
            const book = await this.booksService.findOne(item.bookId);
            if (book.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stock insuffisant pour ${book.title}`);
            }
            const subtotal = book.price * item.quantity;
            totalPrice += subtotal;
            orderItems.push(this.orderItemRepo.create({
                order: savedOrder,
                bookId: book.id,
                quantity: item.quantity,
                unitPrice: book.price,
                subtotal,
            }));
            await this.booksService.decreaseStock(book.id, item.quantity);
        }
        await this.orderItemRepo.save(orderItems);
        savedOrder.totalPrice = totalPrice;
        await this.orderRepo.save(savedOrder);
        await this.cartService.clearCart(userId);
        return savedOrder;
    }
    async confirmOrder(id, userId) {
        const order = await this.findUserOrder(id, userId);
        if (order.status !== enums_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Order cannot be confirmed');
        }
        order.status = enums_1.OrderStatus.CONFIRMED;
        return this.orderRepo.save(order);
    }
    async findMyOrders(userId) {
        return this.orderRepo.find({
            where: { userId },
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }
    async findUserOrder(id, userId) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return order;
    }
    async getStatus(id, userId) {
        const order = await this.findUserOrder(id, userId);
        return order.status;
    }
    async cancelOrder(id, userId) {
        const order = await this.findUserOrder(id, userId);
        if (order.status !== enums_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only PENDING orders can be cancelled');
        }
        order.status = enums_1.OrderStatus.CANCELLED;
        return this.orderRepo.save(order);
    }
    async findAll(status, userId) {
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
    async findOneAdmin(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findOneAdmin(id);
        order.status = status;
        return this.orderRepo.save(order);
    }
    async refundOrder(id) {
        const order = await this.findOneAdmin(id);
        order.status = enums_1.OrderStatus.CANCELLED;
        return this.orderRepo.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService,
        books_service_1.BooksService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map