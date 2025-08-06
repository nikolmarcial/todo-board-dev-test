import { Routes } from '@angular/router';
import { LoginComponent } from './features/users/login/login.component';
import { RegisterComponent } from './features/users/register/register.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
