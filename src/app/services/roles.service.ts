import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Role } from '../core/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly API_URL = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto<Role[]>> {
    return this.http.get<ResponseDto<Role[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Role>> {
    return this.http.get<ResponseDto<Role>>(`${this.API_URL}/${id}`);
  }

  create(role: any): Observable<ResponseDto<Role>> {
    return this.http.post<ResponseDto<Role>>(this.API_URL, role);
  }

  update(id: number, role: any): Observable<ResponseDto<Role>> {
    return this.http.patch<ResponseDto<Role>>(`${this.API_URL}/${id}`, role);
  }

  delete(id: number): Observable<ResponseDto<Role>> {
    return this.http.delete<ResponseDto<Role>>(`${this.API_URL}/${id}`);
  }
}