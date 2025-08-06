import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  template: `<h1>Todo Board</h1>`
})
export class AppComponent {

  constructor(private userService: UserService) {
    // Test register
    this.userService.register({ username: 'sampleuser13', password: 'password123' }).subscribe({
      next: res => {
        console.log('Register Success:', res);

        this.userService.login({ username: 'sampleuser13', password: 'password123' }).subscribe({
          next: loginRes => {
            console.log('Login Success:', loginRes);

            this.userService.getProtected(loginRes.token).subscribe({
              next: protectedRes => {
                console.log('Protected Route:', protectedRes);
              },
              error: err => console.error('Protected Error:', err)
            });
          },
          error: err => console.error('Login Error:', err)
        });
      },
      error: err => console.error('Register Error:', err)
    });
  }
}
