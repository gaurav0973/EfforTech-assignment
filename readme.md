# User Management Web Application

## Overview

This is a full-stack user management web application that allows for managing user data with features for creating, viewing, and bulk uploading users via Excel files.

## Application Screenshots

Below are some screenshots of the application:

![Screenshot 1](./sampleImages/01.png)

![Screenshot 2](./sampleImages/02.png)

## Technologies Used

### Backend

- Node.js with Express.js
- PostgreSQL database
- Prisma ORM
- Multer for file uploads
- XLSX for Excel file processing

### Frontend

- React 19
- React Router DOM
- Tailwind CSS
- Axios for API requests
- React Hot Toast for notifications

## Features

- User management (Create, Read)
- Form validation
- Bulk upload of users via Excel files
- Responsive UI

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

#### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/user_management"
   PORT=5000
   ```

   Replace `username`, `password`, and `user_management` with your PostgreSQL credentials and database name.

4. Set up the database:
   ```
   npx prisma migrate deploy
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

## How to Run Locally

### Start the Backend Server

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Run the development server:
   ```
   npm run dev
   ```
   The server will start on http://localhost:5000

### Start the Frontend Application

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Run the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Database Schema

The application uses a PostgreSQL database with the following schema:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  firstName String   @db.VarChar(100)
  lastName  String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  phone     String   @db.VarChar(10)
  pan       String   @db.Char(10)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Excel Template Format

For bulk uploading users, use an Excel file with the following columns:

- First Name
- Last Name
- Email
- Phone Number
- PAN (Permanent Account Number)

A sample Excel template is included in the repository.


## API Endpoints

### User Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Upload Endpoints

- `POST /api/upload/users` - Bulk upload users from Excel file

## Known Issues and Limitations

- The application currently only supports read and create operations
- Excel uploads must strictly follow the provided template format

## Future Enhancements

- Implement user authentication and authorization
- Add pagination for the user list
- Include filtering and sorting options

---

Developed as part of the EfforTech Full-Stack Developer Assignment
