import { Book } from '.';

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
  book?: Book;
}
