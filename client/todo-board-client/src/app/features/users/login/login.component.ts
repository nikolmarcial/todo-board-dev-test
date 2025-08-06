import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
          alert('Login successful!');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error(err);
          alert('Login failed.');
        }
      });
  }
}
