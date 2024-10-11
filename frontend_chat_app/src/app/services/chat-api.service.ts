import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ChatApiService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // Adjust this to your Django API URL
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.token}`
    });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password })
      .pipe(tap((response: any) => {
        this.token = response.token;
      }));
  }

  createChatRoom(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatrooms/`, { name }, { headers: this.getHeaders() });
  }

  getChatRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chatrooms/`, { headers: this.getHeaders() });
  }

  sendMessage(roomId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages/`, { room: roomId, content }, { headers: this.getHeaders() });
  }

  getMessages(roomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/?room=${roomId}`, { headers: this.getHeaders() });
  }

  checkApiStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

}
