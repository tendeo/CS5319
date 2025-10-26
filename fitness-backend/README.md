# Fitness Tracker Backend

A Spring Boot REST API backend for the fitness tracking application.

## Features

- **User Management**: Create, read, update, and delete user profiles
- **Workout Tracking**: Log workouts with exercises, duration, and calories burned
- **Goal Setting**: Set and track fitness goals with progress monitoring
- **RESTful API**: Clean REST endpoints for frontend integration
- **CORS Enabled**: Configured to work with React frontend on port 3001

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/username/{username}` - Get user by username

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/{id}` - Get workout by ID
- `GET /api/workouts/user/{userId}` - Get workouts by user
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout
- `GET /api/workouts/user/{userId}/type/{type}` - Get workouts by user and type
- `GET /api/workouts/user/{userId}/date-range?startDate=...&endDate=...` - Get workouts by date range

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/{id}` - Get goal by ID
- `GET /api/goals/user/{userId}` - Get goals by user
- `GET /api/goals/user/{userId}/status/{status}` - Get goals by user and status
- `GET /api/goals/user/{userId}/category/{category}` - Get goals by user and category
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

## Database

- **H2 In-Memory Database**: For development and testing
- **H2 Console**: Available at `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## Running the Application

1. **Start the backend:**
   ```bash
   cd fitness-backend/fitness-tracker-backend
   ./gradlew bootRun
   ```

2. **The API will be available at:** `http://localhost:8080`

3. **H2 Database Console:** `http://localhost:8080/h2-console`

## Integration with React Frontend

The backend is configured with CORS to allow requests from:
- `http://localhost:3001` (your React app)
- `http://localhost:3000` (alternative port)

### Example API Calls from React

```javascript
// Fetch all users
const response = await fetch('http://localhost:8080/api/users');
const users = await response.json();

// Create a new workout
const workout = {
  name: "Morning Run",
  type: "cardio",
  startTime: "2024-01-01T08:00:00",
  userId: 1
};

const response = await fetch('http://localhost:8080/api/workouts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(workout)
});
```

## Data Models

### User
- Basic profile information (name, email, username)
- Physical attributes (height, weight, fitness level)
- Relationships to workouts and goals

### Workout
- Workout details (name, type, duration, calories)
- Timestamps (start/end time)
- Relationship to user and exercises

### Exercise
- Exercise details (name, category, sets, reps, weight)
- Duration and rest time
- Relationship to workout

### Goal
- Goal information (title, description, target date)
- Progress tracking (current value, target value)
- Status and category
- Relationship to user

## Development Notes

- The application uses Spring Boot 3.x with Java 17
- JPA/Hibernate for database operations
- H2 in-memory database for development
- CORS configured for React frontend integration
- All endpoints return JSON responses