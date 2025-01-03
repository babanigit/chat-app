// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form (ngSubmit)="onSubmit()" >
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
            />
          </div>

          <div class="error-message" *ngIf="errorMsg">{{ errorMsg }}</div>

          <button type="submit" >
            Register
          </button>
        </form>

        <p>Already have an account? <a routerLink="/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [
    `
      // Same styles as login component
    `,
  ],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username && this.email && this.password) {
      this.authService
        .register(this.username, this.email, this.password)
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.errorMsg =
              error.error?.error || 'Registration failed. Please try again.';
          },
        });
    }
  }
}
