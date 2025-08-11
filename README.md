# To-Do Board

A full-stack task management application with authentication, drag-and-drop board, due date notifications, draft saving, and update history tracking.
---

## 📌 Features

- **Authentication**
  - Secure login with JWT
  - Single user board (one board per account)
- **Task Management**
  - Create tasks with:
    - Title
    - Description
    - Label/Category
    - Due Date
  - Drag-and-drop tasks between columns
  - Auto-save description drafts
  - Expiry date warnings (due soon & overdue)
  - Task history tracking
- **UI/UX**
  - First-time user guide popup after login
  - Responsive design
  - Simple "Today's Tasks" modal
- **Backend**
  - Node.js + Express API
  - Microsoft SQL Server database
- **Frontend**
  - Angular 17 + Angular Material

---
---

## Tech Stack

**Frontend**
- Angular 17
- Angular Material
- SCSS

**Backend**
- Node.js
- Express.js
- Microsoft SQL Server

---

## Project Structure

```
root/
├── backend/           # Node.js + Express API
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/          # Angular app
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md
└── database/
    └── schema.sql     # SQL scripts for database setup
```
---

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

3. Create `.env` file in the backend root. Here's the sample env for local:
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

   If from backend folder:
   ```bash
   cd ../client/todo-board-cient
   ```

   If from root folder:
   ```bash
   cd client
   cd todo-board-cient
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

---

## Usage

1. Register or login.
2. On **first login**, follow the on-screen **"Got It"** guide explaining:
   - How to add a task
   - How to drag & drop between columns
   - How to view task history
   - How to check "Today's Tasks"
3. Create your first task.
4. Drag and drop to change status.
5. View history for label changes.

---

## Future Enhancements

- Multiple boards per user
- Email & push notifications
- Board sharing with other users
- Search & filtering

---

## Git Workflow

I follow best Git practices:
- **Feature branches**: `feature/frontend`, `feature/backend`
- **Dev branch**: All merged features are tested here before going to main.
- Commit messages should be clear and meaningful.

