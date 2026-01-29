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
  coverImage?: string;     // Optional - cover image URL (backend field name)
  imageUrl?: string;       // Optional - alias for coverImage (for compatibility)
  categoryId?: string;     // Optional - which category it belongs to
  category?: CategoryBook;     // Optional - full category object (populated by backend)
  isActive?: boolean;      // Optional - is book active/visible
  publishedDate?: Date;    // Optional
  createdAt?: Date;        // When added to database
  updatedAt?: Date;        // Last modification
  avgRating?: number;      // Optional - average rating from reviews (calculated by backend)
  reviewsCount?: number;   // Optional - number of reviews (calculated by backend)
  totalSales?: number;     // Optional - total number of sales
}

/**
 * Category Model
 */
export interface CategoryBook {
  id: string;
  name: string;            // e.g., "Fiction", "Science"
  description?: string;
}
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  booksCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CategoryBooksResponse {
  category: {
    id: string;
    name: string;
    description?: string;
  };
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryStatsResponse {
  category: {
    id: string;
    name: string;
    description?: string;
  };
  stats: {
    totalBooks: number;
    totalStock: number;
    avgPrice: number;
    avgRating: number;
    totalReviews: number;
    totalSales: number;
  };
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
