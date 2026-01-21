import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(createCartItemDto: CreateCartItemDto): Promise<import("../../database/entities").CartItem>;
    updateItem(updateCartItemDto: UpdateCartItemDto): Promise<import("../../database/entities").CartItem | {
        message: string;
    }>;
    removeItem(userId: string, bookId: string): Promise<{
        message: string;
    }>;
    getCart(userId: string): Promise<{
        items: never[];
        total: number;
    } | {
        items: import("../../database/entities").CartItem[];
        total: number;
        userId: string;
        user: import("../../database/entities").User;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    calculateTotal(userId: string, tax?: string): Promise<{
        subtotal: number;
        tax: number;
        total: number;
    }>;
}
