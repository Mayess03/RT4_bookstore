import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Book } from '../../database/entities/book.entity';
import { User } from '../../database/entities/user.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const { userId } = createCartDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    let cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      cart = this.cartRepository.create({ userId });
      return this.cartRepository.save(cart);
    }

    return cart;
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.book'],
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException(`User ${userId} not found`);
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(createCartItemDto: CreateCartItemDto) {
    const { userId, bookId, quantity } = createCartItemDto;
    if (quantity <= 0) throw new BadRequestException('Quantity must be > 0');

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book || !book.isActive)
      throw new NotFoundException('Book not available');
    if (book.stock < quantity)
      throw new BadRequestException('Insufficient stock');

    const cart = await this.getOrCreateCart(userId);

    let item = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, bookId },
      relations: ['book'],
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartItemRepository.create({
        cartId: cart.id,
        bookId,
        quantity,
      });
    }

    return this.cartItemRepository.save(item);
  }

  async updateItemQuantity(updateCartItemDto: UpdateCartItemDto) {
    const { userId, bookId, quantity } = updateCartItemDto;
    if (quantity < 0) throw new BadRequestException('Quantity must be >= 0');

    const cart = await this.getOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, bookId },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    if (quantity === 0) {
      await this.cartItemRepository.remove(item);
      return { message: 'Item removed' };
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book || book.stock < quantity)
      throw new BadRequestException('Insufficient stock');

    item.quantity = quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(userId: string, bookId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, bookId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItemRepository.remove(item);
    return { message: 'Item removed' };
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.book'],
    });

    if (!cart) return { items: [], total: 0 };

    const total = cart.items.reduce(
      (acc, it) => acc + Number(it.book.price) * it.quantity,
      0,
    );

    return { ...cart, items: cart.items, total };
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    if (!cart.items || cart.items.length === 0)
      return { message: 'Cart already empty' };
    await this.cartItemRepository.delete({ cartId: cart.id });
    return { message: 'Cart cleared' };
  }

  async calculateTotal(userId: string, taxRate = 0) {
    const cart = await this.getCart(userId);
    const subtotal = cart.total || 0;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }

  async checkStock(bookId: string, quantity: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) return false;
    return book.stock >= quantity && book.isActive;
  }
}
