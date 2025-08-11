# To-Do Board

A full-stack task management application with authentication, drag-and-drop board, due date notifications, draft saving, and update history tracking.

## Features

- **Authentication**
  - User login and registration.
  - JWT-based authentication.

- **Task Management**
  - Create, edit, and delete tasks.
  - Categories: "To Do", "In Progress", "Done".
  - Each task has a title, description, and due date.
  - Auto-save drafts for interrupted edits.
  - Due soon and overdue notifications.

- **Drag-and-Drop Board**
  - Implemented using native HTML Drag and Drop API.
  - Smooth Trello-like experience.

- **Notifications**
  - Visual indicators: badges, color changes.
  - Snackbar toast notifications.

- **History Tracking**
  - Tracks changes in task status.

## Tech Stack

**Frontend:** Angular, Angular Material, SCSS  
**Backend:** Node.js, Express  
**Database:** Microsoft SQL Server

## Installation

### Prerequisites
- Node.js (>= 16.x)
- npm (>= 8.x)
- Microsoft SQL Server
- ODBC Driver 17 for SQL Server

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nikolmarcial/todo-board-dev-test
   cd todo-board-dev-test/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the backend root:
   ```env
   PORT=5000
   DB_CONNECTION_STRING=Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=todo_board;Trusted_Connection=Yes;
   JWT_SECRET=enteryoursupersecret
   ```

4. Run the SQL scripts in your SQL Server:
   ```sql
      -- Drop tables if they already exist (to allow recreation)
      IF OBJECT_ID('dbo.task_history', 'U') IS NOT NULL
         DROP TABLE dbo.task_history;

      IF OBJECT_ID('dbo.tasks', 'U') IS NOT NULL
         DROP TABLE dbo.tasks;

      IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
         DROP TABLE dbo.users;


      -- Create users table
      CREATE TABLE dbo.users (
         id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
         username VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL,
         created_at DATETIME NULL
      );

      -- Create tasks table
      CREATE TABLE dbo.tasks (
         id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
         title NVARCHAR(255) NULL,
         label NVARCHAR(50) NULL,
         description NVARCHAR(MAX) NULL,
         due_date DATETIME NULL,
         completed BIT NULL,
         created_by INT NULL,
         created_at DATETIME NULL,
         CONSTRAINT FK_tasks_users_created_by FOREIGN KEY (created_by) REFERENCES dbo.users(id)
      );

      -- Create task_history table
      CREATE TABLE dbo.task_history (
         id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
         task_id INT NOT NULL,
         old_label NVARCHAR(50) NULL,
         new_label NVARCHAR(50) NULL,
         changed_at DATETIME2(7) NULL,
         moved_by NVARCHAR(100) NULL,
         CONSTRAINT FK_task_history_tasks_task_id FOREIGN KEY (task_id) REFERENCES dbo.tasks(id)
      );

   ```

5. Start the backend server:
   ```bash
   node index.js
   ```

### Frontend Setup

1. Go to the frontend folder:
   ```bash
   cd ../client/todo-board-cient
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   ng serve
   ```

4. Open the app in your browser:
   ```
   http://localhost:4200
   ```

## Usage

1. Register or log in.
2. Create tasks and assign categories.
3. Drag and drop tasks to change their status.
4. Get notified when tasks are due soon or overdue.
5. View and manage your task update history.

## Git Workflow

I follow best Git practices:
- **Feature branches**: `feature/frontend`, `feature/backend`
- **Dev branch**: All merged features are tested here before going to main.
- Commit messages should be clear and meaningful.

