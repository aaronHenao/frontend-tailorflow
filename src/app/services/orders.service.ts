import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateProductPayload, CreateOrderPayload } from '../core/models api/api.model';
import { ResponseDto } from '../core/models/response.dto';
import { Product } from '../core/models/product.model';
import { Order, OrderWithProducts } from '../core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly API_URL = `${environment.apiUrl}/orders`;

  private readonly PRODUCT_API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseDto<Order[]>> {
    return this.http.get<ResponseDto<any>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Order>> {
    return this.http.get<ResponseDto<Order>>(`${this.API_URL}/${id}`);
  }

  create(order: CreateOrderPayload): Observable<ResponseDto<Order>> {
    return this.http.post<ResponseDto<Order>>(this.API_URL, order);
  }

  update(id: number, order: any): Observable<ResponseDto<Order>> {
    return this.http.patch<ResponseDto<Order>>(`${this.API_URL}/${id}`, order);
  }
  createProduct(productPayload: CreateProductPayload): Observable<ResponseDto<Product>> {
    return this.http.post<ResponseDto<Product>>(this.PRODUCT_API_URL, productPayload);
  }

  getOrderWithProducts(id: number): Observable<ResponseDto<OrderWithProducts>> {
    return this.http.get<ResponseDto<OrderWithProducts>>(`${this.API_URL}/${id}`);
  }

  updateProduct(productId: number, productData: any): Observable<ResponseDto<Product>> {
    return this.http.patch<ResponseDto<Product>>(`${this.PRODUCT_API_URL}/${productId}`, productData);
  }
}