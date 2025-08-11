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
