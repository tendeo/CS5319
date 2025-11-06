# Quick Start Guide

## Overview
This is the **Layered Architecture** version of the Fitness Tracking App.

- **Backend Port**: 8081 (different from original app)
- **Frontend Port**: Auto-assigned by Vite (usually 3000 or next available)
- **Database**: PostgreSQL on port 5432

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher

## Setup Instructions

### 1. Database Setup

Create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fitnessdb;

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd fitness-backend/fitness-tracker-backend

# Update database credentials in src/main/resources/application.properties
# Change username/password if needed

# Run the backend (runs on port 8081)
./gradlew bootRun
```

The backend will be available at: `http://localhost:8081`

### 3. Frontend Setup

In a new terminal:

```bash
# Navigate to project root
cd /Users/colbypapadakis/CS5319-3

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at the URL shown in terminal (usually `http://localhost:3000`)

## Verification

### Test Backend
```bash
# Get all users
curl http://localhost:8081/api/users

# Expected: [] or list of users
```

### Test Frontend
Open browser to the frontend URL and you should see the Fitness Tracking App.

## Architecture Highlights

This version implements a **4-Layer Architecture**:

1. **Presentation Layer** (Controllers) - HTTP handling
2. **Business Logic Layer** (Services) - Business rules
3. **Data Mapping Layer** (DTOs & Mappers) - Data transformation
4. **Data Access Layer** (Repositories & Entities) - Database operations

## Key Differences from Original

| Aspect | Original | Layered Version |
|--------|----------|-----------------|
| **Port** | 8080 | 8081 |
| **Controllers** | Direct repository access | Use services |
| **DTOs** | No DTOs | DTOs for all operations |
| **Services** | No service layer | Full service layer |
| **Mappers** | No mappers | Entity-DTO mappers |
| **Security** | Passwords exposed | Passwords excluded from DTOs |

## Documentation

- **README.md** - Comprehensive architecture documentation
- **ARCHITECTURE.md** - Detailed layer descriptions and diagrams
- **QUICKSTART.md** (this file) - Quick setup guide

## Troubleshooting

### Port Already in Use
If port 8081 is in use, change it in:
- `fitness-backend/fitness-tracker-backend/src/main/resources/application.properties`
- `src/services/api.ts`

### Database Connection Error
Verify PostgreSQL is running:
```bash
pg_isready
```

Check credentials in `application.properties`.

### Build Errors
Clean and rebuild:
```bash
cd fitness-backend/fitness-tracker-backend
./gradlew clean build
```

## Testing

Run backend tests:
```bash
cd fitness-backend/fitness-tracker-backend
./gradlew test
```

## Stopping the Application

- Backend: Press `Ctrl+C` in the terminal running `gradlew bootRun`
- Frontend: Press `Ctrl+C` in the terminal running `npm run dev`

## Next Steps

1. Review `README.md` for detailed architecture explanation
2. Review `ARCHITECTURE.md` for design patterns and best practices
3. Explore the code structure in each layer
4. Try creating users, workouts, and goals through the UI
5. Examine the API calls in browser DevTools

## Support

For issues or questions, refer to:
- README.md - Architecture overview
- ARCHITECTURE.md - Detailed documentation
- Spring Boot documentation
- React documentation

