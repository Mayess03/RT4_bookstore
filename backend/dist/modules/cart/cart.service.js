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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../../database/entities/cart.entity");
const cart_item_entity_1 = require("../../database/entities/cart-item.entity");
const book_entity_1 = require("../../database/entities/book.entity");
const user_entity_1 = require("../../database/entities/user.entity");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    bookRepository;
    userRepository;
    constructor(cartRepository, cartItemRepository, bookRepository, userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }
    async create(createCartDto) {
        const { userId } = createCartDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        let cart = await this.cartRepository.findOne({ where: { userId } });
        if (!cart) {
            cart = this.cartRepository.create({ userId });
            return this.cartRepository.save(cart);
        }
        return cart;
    }
    async getOrCreateCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.book'],
        });
        if (!cart) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException(`User ${userId} not found`);
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
        }
        return cart;
    }
    async addItem(createCartItemDto) {
        const { userId, bookId, quantity } = createCartItemDto;
        if (quantity <= 0)
            throw new common_1.BadRequestException('Quantity must be > 0');
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book || !book.isActive)
            throw new common_1.NotFoundException('Book not available');
        if (book.stock < quantity)
            throw new common_1.BadRequestException('Insufficient stock');
        const cart = await this.getOrCreateCart(userId);
        let item = await this.cartItemRepository.findOne({
            where: { cartId: cart.id, bookId },
            relations: ['book'],
        });
        if (item) {
            item.quantity += quantity;
        }
        else {
            item = this.cartItemRepository.create({
                cartId: cart.id,
                bookId,
                quantity,
            });
        }
        return this.cartItemRepository.save(item);
    }
    async updateItemQuantity(updateCartItemDto) {
        const { userId, bookId, quantity } = updateCartItemDto;
        if (quantity < 0)
            throw new common_1.BadRequestException('Quantity must be >= 0');
        const cart = await this.getOrCreateCart(userId);
        const item = await this.cartItemRepository.findOne({
            where: { cartId: cart.id, bookId },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        if (quantity === 0) {
            await this.cartItemRepository.remove(item);
            return { message: 'Item removed' };
        }
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book || book.stock < quantity)
            throw new common_1.BadRequestException('Insufficient stock');
        item.quantity = quantity;
        return this.cartItemRepository.save(item);
    }
    async removeItem(userId, bookId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.cartItemRepository.findOne({
            where: { cartId: cart.id, bookId },
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        await this.cartItemRepository.remove(item);
        return { message: 'Item removed' };
    }
    async getCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.book'],
        });
        if (!cart)
            return { items: [], total: 0 };
        const total = cart.items.reduce((acc, it) => acc + Number(it.book.price) * it.quantity, 0);
        return { ...cart, items: cart.items, total };
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        if (!cart.items || cart.items.length === 0)
            return { message: 'Cart already empty' };
        await this.cartItemRepository.delete({ cartId: cart.id });
        return { message: 'Cart cleared' };
    }
    async calculateTotal(userId, taxRate = 0) {
        const cart = await this.getCart(userId);
        const subtotal = cart.total || 0;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }
    async checkStock(bookId, quantity) {
        const book = await this.bookRepository.findOne({ where: { id: bookId } });
        if (!book)
            return false;
        return book.stock >= quantity && book.isActive;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map