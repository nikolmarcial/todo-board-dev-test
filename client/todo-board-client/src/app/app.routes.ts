import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/features/users/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/features/users/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/tasks/tasks.component').then((m) => m.TasksComponent),
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/tasks/task-create/task-create.component').then(
            (m) => m.TaskCreateComponent,
          ),
      },
    ],
  },
  {
    path: 'board',
    loadComponent: () =>
      import('./features/tasks/task-board/task-board.component').then(
        (m) => m.TaskBoardComponent,
      ),
    canActivate: [AuthGuard], // if applicable
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
