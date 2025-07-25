import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  submit() {
  const loginData = {
    name: this.username,
    email: this.email,
    password: this.password
  };

  this.http.post('http://localhost:5000/login', loginData)
    .subscribe((res: any) => {
      console.log(res);
      if (res.token && res._id) {
        localStorage.setItem('JWT_token', res.token);
        localStorage.setItem('id', res._id);
        console.log('User ID & token stored:', res._id, res.token);
        this.router.navigate(['/home']); 
      } else {
        console.log('Login failed:', res);
      }
    });
}


  signup(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}
