import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private uri='http://localhost:3000/api/v1/categories';
  constructor(
    private http:HttpClient
  ) { }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.uri);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.uri}/${categoryId}`);
  }

  createCategory(category:Category):Observable<Category>{
    return this.http.post<Category>(this.uri,category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.uri}/${category.id}`, category);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.uri}/${categoryId}`);
  }
}
