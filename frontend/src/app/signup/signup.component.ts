import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  registerURL = "http://127.0.0.1:5000/register";

  constructor(private http: HttpClient, private router: Router) {}

  submit() {
    const data = {
      name: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post(this.registerURL, data).subscribe({
      next: (res) => {
        console.log('Signup success:', res);
        // After signup, go to login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup error:', err);
      }
    });
  }

  login(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
