import { Book } from '../../shared/models';

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  createdAt: Date;
  book?: Book;
}
