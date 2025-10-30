import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto'; 
import { Area } from '../core/models/area.model'; 


interface AreasPaginatedResponse {
    areas: Area[];
    total: number;
    page: number;
    totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  private readonly API_URL = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) {}

  
  getAllPaginated(page: number, limit: number): Observable<ResponseDto<AreasPaginatedResponse>> {
    return this.http.get<ResponseDto<AreasPaginatedResponse>>(`${this.API_URL}?page=${page}&limit=${limit}`);
  }
  
  getAllForForms(): Observable<ResponseDto<Area[]>> {
    return this.http.get<ResponseDto<Area[]>>(`${this.API_URL}/all`);
  }

  getById(id: number): Observable<ResponseDto<Area>> {
    return this.http.get<ResponseDto<Area>>(`${this.API_URL}/${id}`);
  }

  create(area: Area): Observable<ResponseDto<Area>> {
    return this.http.post<ResponseDto<Area>>(this.API_URL, area);
  }

  update(id: number, area: Area): Observable<ResponseDto<Area>> {
    return this.http.patch<ResponseDto<Area>>(`${this.API_URL}/${id}`, area);
  }

  delete(id: number): Observable<ResponseDto<Area>> {
    return this.http.delete<ResponseDto<Area>>(`${this.API_URL}/${id}`);
  }
}