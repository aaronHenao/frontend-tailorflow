import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Product } from '../core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<Product[]>> {
    return this.http.get<ResponseDto<Product[]>>(this.API_URL);
  }

  getById(id: number): Observable<ResponseDto<Product>> {
    return this.http.get<ResponseDto<Product>>(`${this.API_URL}/${id}`);
  }

  create(product: any): Observable<ResponseDto<Product>> {
    return this.http.post<ResponseDto<Product>>(this.API_URL, product);
  }

  update(id: number, product: any): Observable<ResponseDto<Product>> {
    return this.http.patch<ResponseDto<Product>>(`${this.API_URL}/${id}`, product);
  }

  delete(id: number): Observable<ResponseDto<Product>> {
    return this.http.delete<ResponseDto<Product>>(`${this.API_URL}/${id}`);
  }
}