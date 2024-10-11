import { Component } from '@angular/core';
import { ChatApiService } from '../../services/chat-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private chatService: ChatApiService, private router: Router) {}

  onSubmit() {
    console.log('Form submitted!');

    console.log( this.username, this.password)
    this.chatService.login(this.username, this.password).subscribe(
      () => this.router.navigate(['/chat-rooms']),
      error => console.error('Login failed:', error)
    );
  }

}
