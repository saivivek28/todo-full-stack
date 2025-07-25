import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AddtasksComponent } from './addtasks/addtasks.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent},
    {path:'home', component:HomeComponent, canActivate:[AuthGuard]},
    {path:'add_tasks', component:AddtasksComponent, canActivate:[AuthGuard]},
    {path: 'update/:id', component: EditComponent}

];
