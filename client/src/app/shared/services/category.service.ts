import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService {
  private readonly apiUrlCategories = `${this.apiUrl}/categories`;


  /**
   * CAT-01: Get all categories
   */
  findAll(withBookCount: boolean = false): Observable<Category[]> {
    let params = new HttpParams();
    if (withBookCount) {
      params = params.set('withBookCount', 'true');
    }
    return this.http.get<Category[]>(this.apiUrlCategories, { params });
  }

  /**
   * CAT-02: Get category by ID
   */
  findById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrlCategories}/${id}`);
  }

  /**
   * CAT-03: Get books by category with pagination
   */
  findBooksByCategory(
    id: string,
    limit: number = 10,
    page: number = 1
  ): Observable<CategoryBooksResponse> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());

    return this.http.get<CategoryBooksResponse>(`${this.apiUrlCategories}/${id}/books`, { params });
  }

  /**
   * CAT-04: Create category (ADMIN)
   */
  create(dto: CreateCategoryDto): Observable<Category> {
    console.log('creating ')
    return this.http.post<Category>(this.apiUrlCategories, dto);
  }

  /**
   * CAT-05: Update category (ADMIN)
   */
  update(id: string, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrlCategories}/${id}`, dto);
  }

  /**
   * CAT-06: Delete category (ADMIN)
   */
  remove(id: string): Observable<{ message: string; deletedCategory: { id: string; name: string } }> {
    return this.http.delete<{ message: string; deletedCategory: { id: string; name: string } }>(
      `${this.apiUrlCategories}/${id}`
    );
  }

  /**
   * CAT-07: Get category statistics (ADMIN)
   */
  getCategoryStats(id: string): Observable<CategoryStatsResponse> {
    return this.http.get<CategoryStatsResponse>(`${this.apiUrlCategories}/${id}/stats`);
  }
}
