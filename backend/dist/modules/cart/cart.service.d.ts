import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { Book } from '../../database/entities/book.entity';
import { User } from '../../database/entities/user.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private readonly cartRepository;
    private readonly cartItemRepository;
    private readonly bookRepository;
    private readonly userRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, bookRepository: Repository<Book>, userRepository: Repository<User>);
    create(createCartDto: CreateCartDto): Promise<Cart>;
    getOrCreateCart(userId: string): Promise<Cart>;
    addItem(createCartItemDto: CreateCartItemDto): Promise<CartItem>;
    updateItemQuantity(updateCartItemDto: UpdateCartItemDto): Promise<CartItem | {
        message: string;
    }>;
    removeItem(userId: string, bookId: string): Promise<{
        message: string;
    }>;
    getCart(userId: string): Promise<{
        items: never[];
        total: number;
    } | {
        items: CartItem[];
        total: number;
        userId: string;
        user: User;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    calculateTotal(userId: string, taxRate?: number): Promise<{
        subtotal: number;
        tax: number;
        total: number;
    }>;
    checkStock(bookId: string, quantity: number): Promise<boolean>;
}
