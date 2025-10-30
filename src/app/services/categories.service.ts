import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Category } from '../core/models/category.model'; 


interface CategoriesPaginatedResponse {
    categories: Category[];
    total: number;
    page: number;
    totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly API_URL = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAllPaginated(page: number, limit: number): Observable<ResponseDto<CategoriesPaginatedResponse>> {
    return this.http.get<ResponseDto<CategoriesPaginatedResponse>>(`${this.API_URL}?page=${page}&limit=${limit}`);
  }
  

  getAllForForms(): Observable<ResponseDto<Category[]>> {
    return this.http.get<ResponseDto<Category[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Category>> {
    return this.http.get<ResponseDto<Category>>(`${this.API_URL}/${id}`);
  }

  create(category: Category): Observable<ResponseDto<Category>> {
    return this.http.post<ResponseDto<Category>>(this.API_URL, category);
  }

  update(id: number, category: Category): Observable<ResponseDto<Category>> {
    return this.http.patch<ResponseDto<Category>>(`${this.API_URL}/${id}`, category);
  }

  delete(id: number): Observable<ResponseDto<Category>> {
    return this.http.delete<ResponseDto<Category>>(`${this.API_URL}/${id}`);
  }
}