# Urja Courses Backend

Backend API for the Urja Courses platform with instructor and admin functionality.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Make sure PostgreSQL is installed and running
2. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE course_platform;"
```
3. Create tables:
```bash
psql -U postgres -d course_platform -f database/schema.sql
```
4. Insert seed data:
```bash
npm run seed
```

### 3. Environment Configuration
Update the `.env` file with your database credentials:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/course_platform
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## Test Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Teacher**: username: `teacher1`, password: `teacher123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Teacher signup

### Courses
- `GET /api/courses` - Get courses (all for admin, own for teacher)
- `POST /api/courses` - Create new course (teacher only)
- `PUT /api/courses/:courseId/publish` - Toggle course publish status (admin only)

### Lectures
- `GET /api/courses/:courseId/lectures` - Get lectures for a course
- `POST /api/courses/:courseId/lectures` - Add lecture to course (teacher only)

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── courseController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lecture.js
│   └── routes/
│       ├── authRoutes.js
│       └── courseRoutes.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── app.js
├── server.js
└── package.json
```