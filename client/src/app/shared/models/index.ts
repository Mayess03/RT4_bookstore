/**
 * Barrel Export - Export all models from one place
 * 
 * Why? Instead of:
 *   import { User } from './models/user.model';
 *   import { Book } from './models/book.model';
 *   import { Order } from './models/order.model';
 * 
 * We can do:
 *   import { User, Book, Order } from './models';
 * 
 * Cleaner and easier!
 */

// User models
export * from './user.model';

// Book models
export * from './book.model';

// Cart models
export * from './cart.model';

// Order models
export * from './order.model';
