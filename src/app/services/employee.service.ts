import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Employee } from '../core/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private readonly API_URL = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<Employee[]>> {
    return this.http.get<ResponseDto<Employee[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Employee>> {
    return this.http.get<ResponseDto<Employee>>(`${this.API_URL}/${id}`);
  }

  create(employee: any): Observable<ResponseDto<Employee>> {
    return this.http.post<ResponseDto<Employee>>(this.API_URL, employee);
  }

  update(id: number, employee: any): Observable<ResponseDto<Employee>> {
    return this.http.patch<ResponseDto<Employee>>(`${this.API_URL}/${id}`, employee);
  }

  delete(id: number): Observable<ResponseDto<Employee>> {
    return this.http.delete<ResponseDto<Employee>>(`${this.API_URL}/${id}`);
  }

  getEmployeeDetails(cc: string): Observable<ResponseDto<Employee>>{
      return this.http.get<ResponseDto<Employee>>(`${this.API_URL}/cc/${cc}`);
  }
}
