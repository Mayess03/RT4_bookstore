import { Book } from './book.model';

/**
 * Cart Item - One item in the shopping cart
 * 
 * Example: "3 copies of Harry Potter"
 */
export interface CartItem {
  id: string;              // CartItem UUID
  bookId: string;          // Which book
  book?: Book;             // Full book details (populated by backend)
  quantity: number;        // How many copies
  addedAt?: Date;          // When added to cart
}

/**
 * Cart - User's shopping cart
 */
export interface Cart {
  id: string;
  userId: string;          // Who owns this cart
  items: CartItem[];       // Array of cart items
  updatedAt?: Date;
}

/**
 * Add to Cart DTO - What we SEND to add item to cart
 */
export interface AddToCartDto {
  userId: string;
  bookId: string;
  quantity: number;
}

/**
 * Update Cart Item DTO - Change quantity
 */
export interface UpdateCartItemDto {
  userId: string;
  bookId: string;
  quantity: number;        // New quantity
}
