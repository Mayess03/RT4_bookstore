/**
 * Book Model - Matches backend Book entity
 * 
 * This represents a book in your bookstore
 */

export interface Book {
  id: string;              // UUID
  title: string;           // Book title
  author: string;          // Author name
  isbn: string;            // Unique book identifier
  price: number;           // Price in currency (e.g., 19.99)
  stock: number;           // Available quantity
  description?: string;    // Optional - book description
  imageUrl?: string;       // Optional - cover image URL
  categoryId?: string;     // Optional - which category it belongs to
  category?: Category;     // Optional - full category object (populated by backend)
  publishedDate?: Date;    // Optional
  createdAt?: Date;        // When added to database
  updatedAt?: Date;        // Last modification
}

/**
 * Category Model
 */
export interface Category {
  id: string;
  name: string;            // e.g., "Fiction", "Science"
  description?: string;
}

/**
 * Create Book DTO - What we SEND when admin creates a book
 */
export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  publishedDate?: Date;
}

/**
 * Update Book DTO - What we SEND when admin updates a book
 * All fields optional because we might update only one field
 */
export interface UpdateBookDto {
  title?: string;
  author?: string;
  price?: number;
  stock?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
}
