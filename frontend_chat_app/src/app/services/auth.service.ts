import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'chat_token';
  private tokenSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient) {
    const initialToken = this.getStoredToken();
    this.tokenSubject = new BehaviorSubject<string | null>(initialToken);
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setStoredToken(token: string | null): void {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/`, {
      username,
      email,
      password,
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/users/login/`, {
        username,
        password,
      })
      .pipe(
        map((response) => {
          this.setStoredToken(response.token);
          this.tokenSubject.next(response.token);
          return true;
        })
      );
  }

  logout(): void {
    this.setStoredToken(null);
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
