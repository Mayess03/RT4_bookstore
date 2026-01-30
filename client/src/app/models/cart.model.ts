import { Book } from './book.model';

export interface CartItem {
  id: string;
  bookId: string;
  book?: Book;
  quantity: number;
  addedAt?: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt?: Date;
}

export interface AddToCartDto {
  userId: string;
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  userId: string;
  bookId: string;
  quantity: number;
}
