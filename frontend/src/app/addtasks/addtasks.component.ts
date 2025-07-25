import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-addtasks',
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './addtasks.component.html',
  styleUrl: './addtasks.component.css'
})
export class AddtasksComponent {
taskTitle: string = '';
  taskDescription: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  addTask() {
    const userId = localStorage.getItem('id');
    

    const newTask = {
      task_title: this.taskTitle,
      task_description: this.taskDescription,
      user_id: userId  
    };

    this.http.post('http://localhost:5000/add', newTask).subscribe({
      next: (res) => {
        console.log('Task added:', res);
        alert('Task added!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add task.');
      }
    });
  }
}
