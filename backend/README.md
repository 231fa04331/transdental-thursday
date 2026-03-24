# Temple Spiritual Management System - Backend

Backend API built with Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt, and Cloudinary.

## Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example` and fill values.
3. Run server:
   - Development: `npm run dev`
   - Production: `npm start`

## Architecture

- `src/routes` -> API route definitions
- `src/controllers` -> request/response orchestration
- `src/services` -> business logic
- `src/models` -> Mongoose schemas and indexes
- `src/middlewares` -> auth, role, validation, error handling
- `src/config` -> DB, env, cloudinary config

Flow: Route -> Controller -> Service -> Model

## Authentication

- Student register/login with hashed password (`bcryptjs`)
- Admin login with fixed credentials from env
- JWT token required for protected routes

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`

### Students (Admin)
- `GET /api/students`
- `GET /api/students/:id`
- `DELETE /api/students/:id`

### Attendance
- `POST /api/attendance` (Admin only)
- `GET /api/attendance/:studentId`
- `GET /api/attendance/date/:date` (Admin only)

### Chanting
- `POST /api/chanting`
- `GET /api/chanting/:studentId`

### Book Reading
- `POST /api/books`
- `GET /api/books/:studentId`

### Notifications
- `POST /api/notifications` (Admin only)
- `GET /api/notifications`

### Trips
- `POST /api/trips` (Admin only)
- `GET /api/trips`
- `DELETE /api/trips/:id` (Admin only)

### Gallery
- `POST /api/gallery` (Admin only, multipart file upload or url)
- `GET /api/gallery`

### Content
- `POST /api/content` (Admin only)
- `GET /api/content`

### Chatbot
- `POST /api/chatbot` (Rule-based JSON dataset)

## Core Rules Enforced

- Students cannot mark attendance
- Admin only marks attendance
- Duplicate attendance prevented using unique index `(student, date)`
- Total classes calculated from `present: true`
- Chanting rounds are numeric
- Book reading is text

## Deployment (Render)

- Set all env vars from `.env.example`
- Build command: `npm install`
- Start command: `npm start`
