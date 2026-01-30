
export interface Book {
  id: string;              
  title: string;           
  author: string;        
  isbn: string;            
  price: number;           
  stock: number;          
  description?: string;    
  coverImage?: string;    
  imageUrl?: string;       
  categoryId?: string;   
  category?: CategoryBook;    
  isActive?: boolean;     
  publishedDate?: Date;    
  createdAt?: Date;        
  updatedAt?: Date;        
  avgRating?: number;      
  reviewsCount?: number;   
  totalSales?: number;     
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


export interface UpdateBookDto {
  title?: string;
  author?: string;
  price?: number;
  stock?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
}
