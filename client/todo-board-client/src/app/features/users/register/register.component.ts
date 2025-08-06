import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
})

export class RegisterComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.auth.register({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          alert('Registered successfully!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Registration failed.');
        }
      });
  }
}
