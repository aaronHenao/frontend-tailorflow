import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseDto } from '../core/models/response.dto';
import { Task } from '../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAssignedTasks(): Observable<ResponseDto<Task[]>> {
    return this.http.get<ResponseDto<Task[]>>(`${this.API_URL}/assigned`);
  }

  getTaskById(id: number): Observable<ResponseDto<Task>> {
    return this.http.get<ResponseDto<Task>>(`${this.API_URL}/${id}`);
  }

  startTask(id: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${id}/start`, {});
  }

  completeTask(id: number): Observable<ResponseDto<Task>> {
    return this.http.patch<ResponseDto<Task>>(`${this.API_URL}/${id}/complete`, {});
  }

  getProductTasks(id: number):Observable<ResponseDto<Task[]>>{
    return this.http.get<ResponseDto<Task[]>>(`${this.API_URL}/${id}/product-tasks`);
  }

  getAllTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.API_URL}`);
}

  
}