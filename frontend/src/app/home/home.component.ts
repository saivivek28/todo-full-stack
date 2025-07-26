import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {jwtDecode }from 'jwt-decode';

interface Task {
  _id: string;      
  task_title: string;
  task_description: string;
}
interface MyToken {
  name: string;
  email: string;
  sub:{id:string}
  // ID:string;
  exp: number; // if you set expiry
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})

export class HomeComponent {

  tasks: Task[] = [];
  

  constructor(private http: HttpClient,  private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('JWT_token'); 
    const decoded = jwtDecode<MyToken>(token!);
    const userId = decoded['sub'].id
    console.log(decoded['sub'].id)
    if (userId) {
      this.http.get<Task[]>(`http://localhost:5000/get_tasks/${userId}`) 
        .subscribe(data => {
          this.tasks = data;
          console.log(this.tasks);
        });
    } else {
      console.log('No user logged in');
    }
  }
  add_tasks(){
    this.router.navigate(['add_tasks'])
  }
  edit_task(id:string){
    this.router.navigate(['/update', id]);
  }
  logout(){
    this.router.navigate(['login']);
  }
 delete_task(id: string) {
  this.http.delete(`http://localhost:5000/delete/${id}`).subscribe({
    next: (res) => {
      console.log('Task deleted:', res);
      // Optionally, remove task from local list:
      this.tasks = this.tasks.filter(task => task._id !== id);
    },
    error: (err) => {
      console.error('Error deleting task:', err);
    }
  });
}

}
