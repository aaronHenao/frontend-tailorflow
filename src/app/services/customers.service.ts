import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Customer } from '../core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly API_URL = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseDto<Customer[]>>{
    return this.http.get<ResponseDto<Customer[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Customer>> {
    return this.http.get<ResponseDto<Customer>>(`${this.API_URL}/${id}`);
  }

  create(customer: any): Observable<ResponseDto<Customer>> {
    return this.http.post<ResponseDto<Customer>>(this.API_URL, customer);
  }

  update(id: number, customer: any): Observable<ResponseDto<Customer>> {
    return this.http.patch<ResponseDto<Customer>>(`${this.API_URL}/${id}`, customer);
  }

  getAllForForms(): Observable<ResponseDto<Customer[]>> {
    return this.http.get<ResponseDto<Customer[]>>(`${this.API_URL}/all`);
  }
}