import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Category,
  CategoryBooksResponse,
  CategoryStatsResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../models';


@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService {
  private readonly apiUrlCategories = `${this.apiUrl}/categories`;



  findAll(withBookCount: boolean = false): Observable<Category[]> {
    let params = new HttpParams();
    if (withBookCount) {
      params = params.set('withBookCount', 'true');
    }
    return this.http.get<Category[]>(this.apiUrlCategories, { params });
  }


  findById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrlCategories}/${id}`);
  }


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


  create(dto: CreateCategoryDto): Observable<Category> {
    console.log('creating ')
    return this.http.post<Category>(this.apiUrlCategories, dto);
  }


  update(id: string, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrlCategories}/${id}`, dto);
  }


  remove(id: string): Observable<{ message: string; deletedCategory: { id: string; name: string } }> {
    return this.http.delete<{ message: string; deletedCategory: { id: string; name: string } }>(
      `${this.apiUrlCategories}/${id}`
    );
  }


  getCategoryStats(id: string): Observable<CategoryStatsResponse> {
    return this.http.get<CategoryStatsResponse>(`${this.apiUrlCategories}/${id}/stats`);
  }
}
