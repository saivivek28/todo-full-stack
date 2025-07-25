import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [RouterModule, FormsModule, CommonModule,  HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
taskId = "";
taskTitle= "";
taskDescription = "";

constructor(private http:HttpClient, private router:Router, private route:ActivatedRoute){}

ngOnInit(){
  this.taskId = this.route.snapshot.paramMap.get('id') || "";
  this.http.get<any>(`http://localhost:5000/update/${this.taskId}`).subscribe(task =>{
    this.taskTitle = task.task_title;
    this.taskDescription = task.task_description;
  })
}

updateTask(){
  const updated_task = {
    task_title:this.taskTitle,
    task_description:this.taskDescription
  }
  this.http.put(`http://localhost:5000/update/${this.taskId}`, updated_task).subscribe(res =>{
    alert('Task Updated!!');
    this.router.navigate(['/home'])
  });
}
}
