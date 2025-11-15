import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Credentials } from '../core/models/credentials.model';
import { Observable, tap } from 'rxjs';
import { ResponseDto } from '../core/models/response.dto';
import { LoginResponse } from '../core/models/login-response.dto';
import { tokenKey } from '../common/constants';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: Credentials): Observable<ResponseDto<LoginResponse>> {
    return this.http.post<ResponseDto<LoginResponse>>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data.access_token) {
            localStorage.setItem(tokenKey, response.data.access_token);
          }
        })
      );

  }

  logout(): void {
    localStorage.removeItem(tokenKey);
    this.router.navigate(['']);
  }

  getToken(): string | null {
    return localStorage.getItem(tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token)

  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const expirationDate = decoded.exp * 1000;
      const now = new Date().getTime();

      return expirationDate < now;
    } catch (error) {
      return true;
    }
  }

  getCurrentUser(): LoginResponse | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id_rol: payload.id_rol,
        cc: payload.cc,
        access_token: token
      };

    } catch (error) {
      console.error('Error al decodificar token', error);
      return null;
    }
  }

  getHomeRoute(): string {
    const user = this.getCurrentUser();

    if (!user) {
      return '';
    } 

    return user.id_rol === 1 ? '/admin' : '/employee';
  }
}
