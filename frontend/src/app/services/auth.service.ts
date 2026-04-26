import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { ApiResponse, AuthResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiBaseUrl}/auth`;

  login(payload: { email: string; password: string }) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/login`, payload)
      .pipe(tap(res => this.setSession(res.data.accessToken)));
  }

  register(payload: { name: string; email: string; password: string }) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/register`, payload)
      .pipe(tap(res => this.setSession(res.data.accessToken)));
  }

  setSession(token: string) { localStorage.setItem('token', token); }
  token() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.token(); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
