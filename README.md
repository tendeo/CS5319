# Fitness Tracking Application

**Repository Name:** CS5319 Final Project Group 6-Colby Papadakis, Vikas Deo, Camryn McPhaul

This is a full-stack fitness tracking application built with React (frontend) and Spring Boot (backend). The original project wireframes are available at https://www.figma.com/design/DMTfRyrCyVnqEhyw4Vj5Er/Fitness-Tracking-App-Wireframes.

## Project Structure

This repository contains implementations of two architectural styles:

- **`Selected/`** - **Layered Architecture** (Selected for final implementation)
  - Contains the 4-layer architecture implementation with Service layer, DTOs, and Mappers
  - Location: `Selected/fitness-backend/fitness-tracker-backend/`

- **`Unselected/`** - **Client-Server Architecture** (Unselected architecture)
  - Contains the 2-tier architecture implementation (Controllers directly access Repositories)
  - Location: `Unselected/fitness-backend/fitness-tracker-backend/`

- **Frontend** - Shared React application (works with both architectures)
  - Location: Root directory (`src/`, `package.json`, etc.)

---

## Table of Contents

- [Quick Start Checklist](#quick-start-checklist)
- [Platform Requirements](#platform-requirements)
- [Installation & Configuration](#installation--configuration)
- [Compilation](#compilation)
- [Execution](#execution)
- [Architectural Styles](#architectural-styles)

---

## Quick Start Checklist

**Before running the application, ensure:**

- PostgreSQL is installed and running
- Database `fitnessdb` is created
- Backend `application.properties` is configured with database credentials
- Test configuration file `src/test/resources/application.properties` exists
- Frontend dependencies installed (`npm install`)
- **IMPORTANT:** If your PostgreSQL password contains special characters (`!`, `@`, `#`, `$`, etc.), you MUST use environment variable `DB_PASSWORD`
- Backend runs on port **8081** (frontend is already configured for this)
- Frontend runs on port **3000**

**Common Issues to Avoid:**
- Don't put passwords with special characters directly in `application.properties` - use environment variables
- Don't forget to create the test configuration file - tests will fail without it
- Backend port is 8081, not 8080 - frontend is already configured correctly
- Make sure PostgreSQL service is running before starting backend

---

## Platform Requirements

This application requires the following platforms and tools:

### Frontend Requirements
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **Operating System**: macOS, Linux, or Windows

### Backend Requirements
- **Java**: JDK 17 or higher
- **Gradle**: Version 7.0 or higher (Gradle Wrapper included, no separate installation needed)
- **PostgreSQL**: Version 12 or higher
- **Operating System**: macOS, Linux, or Windows

### Database Requirements
- **PostgreSQL**: Version 12 or higher
- Database name: `fitnessdb` (or configure as needed)

---

## Installation & Configuration

### 1. Install Node.js and npm

**Download:**
- Visit [Node.js Official Website](https://nodejs.org/)
- Download the LTS (Long Term Support) version (18.0 or higher)

**Installation:**

**Windows:**
1. Download the Windows installer (.msi) from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

**macOS:**
```bash
# Using Homebrew 
brew install node

# Or download installer from nodejs.org
# Double-click the .pkg file and follow the installation wizard
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 2. Install Java JDK 17

**Download:**
- Visit [Adoptium](https://adoptium.net/temurin/releases/?version=17) (recommended) or
- [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

**Installation:**

**Windows:**
1. Download the JDK 17 installer from [Adoptium](https://adoptium.net/)
2. Run the installer and follow the setup wizard
3. Set environment variables:
   - `JAVA_HOME`: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
   - Add to PATH: `%JAVA_HOME%\bin`

**macOS:**
```bash
# Using Homebrew 
brew install openjdk@17

# Set JAVA_HOME (add to ~/.zshrc or ~/.bash_profile)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Set JAVA_HOME (add to ~/.bashrc)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

**Verify Installation:**
```bash
java -version  # Should show "openjdk version 17.x.x" or "java version 17.x.x"
javac -version # Should show "javac 17.x.x"
```

### 3. Install PostgreSQL

**Download:**
- Visit [PostgreSQL Official Website](https://www.postgresql.org/download/)
- Choose your operating system

**Installation:**

**Windows:**
1. Download the Windows installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. **Remember the password you set for the `postgres` user** - you'll need it for configuration
4. PostgreSQL service will start automatically

**macOS:**
```bash
# Using Homebrew (recommended)
brew install postgresql@15
brew services start postgresql@15

# Verify installation
psql --version

# Or download Postgres.app from postgresapp.com
# If using Postgres.app, psql is available in the app's bin directory
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Create Database

**Windows:**
```powershell
# One-liner (recommended):
$env:PGPASSWORD='your_password'; & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE fitnessdb;"

# OR interactive:
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
# Then in psql prompt:
CREATE DATABASE fitnessdb;
\q
```

**macOS/Linux:**
```bash
psql -U postgres
# Enter password when prompted, then:
CREATE DATABASE fitnessdb;
\q
```

**Verify PostgreSQL is running:**
- **Windows:** `Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}`
- **macOS/Linux:** `psql -U postgres -c "SELECT 1;"`

### 5. Configure Backend Database Connection

**IMPORTANT:** If your PostgreSQL password contains special characters (like `!`, `@`, `#`, `$`, etc.), you MUST use environment variables.

Edit the database configuration file:
**File:** `Selected/fitness-backend/fitness-tracker-backend/src/main/resources/application.properties`

**Option 1: Password WITHOUT special characters**

```properties
# Database Configuration - PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/fitnessdb
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=your_simple_password

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8081
```

**Option 2: Password WITH special characters (Recommended)**

If your password contains special characters like `!`, `@`, `#`, `$`, etc., use environment variables:

1. Update `application.properties`:
```properties
# Database Configuration - PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/fitnessdb
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8081
```

2. Set environment variable when starting backend (see Execution section)

**Note:** The backend runs on port **8081** (not 8080). The frontend is already configured to connect to port 8081.

### 6. Create Test Configuration File

**Required for tests to pass.** Create a test-specific configuration file:

**For Layered Architecture (Selected):**
**File:** `Selected/fitness-backend/fitness-tracker-backend/src/test/resources/application.properties`

**Windows:**
```powershell
New-Item -ItemType Directory -Force -Path "Selected\fitness-backend\fitness-tracker-backend\src\test\resources"
```

**macOS/Linux:**
```bash
mkdir -p Selected/fitness-backend/fitness-tracker-backend/src/test/resources
```

Then create `application.properties` in that directory with the same database configuration:

```properties
# Database Configuration - PostgreSQL (Test)
spring.datasource.url=jdbc:postgresql://localhost:5432/fitnessdb
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=your_password  # Or ${DB_PASSWORD} if using env var

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 7. Install Frontend Dependencies

Navigate to project root directory:

```bash
npm install
```

**Note:** Frontend is configured for backend on port 8081 (`src/services/api.ts`). No changes needed.

---

## Compilation (Optional)

**Frontend:** `npm run build` (creates `dist/` folder)

**Backend:** `./gradlew build` or `gradlew.bat build` (creates JAR in `build/libs/`)

*Note: Compilation is optional - Gradle compiles automatically when running `bootRun`*

---

## Execution

### Prerequisites

Before executing the system, make sure:
1. PostgreSQL is running
2. Database `fitnessdb` exists
3. Database credentials are configured in `application.properties` (or use environment variable `DB_PASSWORD`)
4. Test configuration file exists: `src/test/resources/application.properties`
5. All dependencies are installed (`npm install` completed)

### Step 1: Verify PostgreSQL is Running

**Windows:**
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# If not running, start it:
Start-Service postgresql-x64-18  # Replace with your service name
```

**macOS/Linux:**
```bash
# Check status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start if needed
brew services start postgresql@15     # macOS
sudo systemctl start postgresql       # Linux
```

### Step 2: Start Backend Server

**For Layered Architecture (Selected):**

**Windows - Using Startup Script (Recommended if password has special characters):**

1. Create/edit `start-backend.ps1` in `Selected/fitness-backend/fitness-tracker-backend/`:
```powershell
# Set PostgreSQL password as environment variable
# REPLACE 'your_postgres_password_here' with YOUR actual PostgreSQL password
$env:DB_PASSWORD='your_postgres_password_here'

# Start the Spring Boot application
.\gradlew.bat bootRun
```

2. Run the script:
```powershell
cd Selected\fitness-backend\fitness-tracker-backend
.\start-backend.ps1
```

**Windows - Using Gradle Directly:**
```powershell
cd Selected\fitness-backend\fitness-tracker-backend

# If password has special characters:
$env:DB_PASSWORD='your_password'
.\gradlew.bat bootRun

# OR if password has no special characters and is in application.properties:
.\gradlew.bat bootRun
```

**macOS/Linux - Using Startup Script (Recommended if password has special characters):**

1. Create/edit `start-backend.sh` in `Selected/fitness-backend/fitness-tracker-backend/`:
```bash
#!/bin/bash
# Set PostgreSQL password as environment variable
# REPLACE 'your_postgres_password_here' with YOUR actual PostgreSQL password
export DB_PASSWORD='your_postgres_password_here'

# Start the Spring Boot application
./gradlew bootRun
```

2. Make it executable and run:
```bash
cd Selected/fitness-backend/fitness-tracker-backend
chmod +x start-backend.sh
./start-backend.sh
```

**macOS/Linux - Using Gradle Directly:**
```bash
cd Selected/fitness-backend/fitness-tracker-backend

# If password has special characters:
export DB_PASSWORD='your_password'
./gradlew bootRun

# OR if password has no special characters and is in application.properties:
./gradlew bootRun
```

**Expected Output:**
```
> Task :bootRun

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.5.7)

... (application logs)
Started FitnessTrackerBackendApplication in X.XXX seconds
```

The backend server will start on **http://localhost:8081**

### Step 3: Start Frontend Development Server

**In a new terminal window/tab:**

```bash
# Navigate to project root
cd /path/to/CS5319  # Your project root path

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

The frontend will start on **http://localhost:3000**

### Step 4: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the Fitness Tracking Application login screen
4. Try creating an account - if you see "Failed to fetch", check:
   - Backend is running on port 8081
   - No firewall blocking the connection
   - Browser console for detailed error messages

### Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running:
  - **Windows:** `Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}`
  - **macOS/Linux:** `psql -U postgres -c "SELECT 1;"`
- Verify database credentials in `application.properties`
- **If password has special characters:** You MUST use environment variable `DB_PASSWORD`
- Check if port 8081 is available:
  - **Windows:** `netstat -ano | findstr :8081`
  - **macOS/Linux:** `lsof -i :8081`
- **Common error "no password was provided":** This means Spring Boot isn't reading your password. Use environment variable approach.

**Test failures with "no password was provided" error:**
- Ensure you've created the test configuration file: `src/test/resources/application.properties`
- Verify the test configuration file has the same database credentials as the main `application.properties`
- Check that the `src/test/resources/` directory exists

**"Failed to fetch" error in frontend:**
- Verify backend is running on port 8081: `netstat -ano | findstr :8081` (Windows) or `lsof -i :8081` (macOS/Linux)
- Check browser console for CORS errors
- Ensure frontend API URL is `http://localhost:8081/api` (check `src/services/api.ts`)
- Backend must be running before frontend can connect

**Frontend won't start:**
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install` (macOS/Linux) or delete `node_modules` and `package-lock.json` then `npm install` (Windows)
- Check if port 3000 is available

**Port already in use:**
- Backend (8081): Change `server.port` in `application.properties`
- Frontend (3000): Use `npm run dev -- --port 3001` to use a different port





---

## Architectural Styles

This application implements two architectural styles, organized in separate directories:

1. **Layered Architecture** (Selected - Located in `Selected/` directory) - 4-layer architecture
   - **Status**: Selected for final implementation
   - **Location**: `Selected/fitness-backend/fitness-tracker-backend/`
   - Contains Service layer, DTOs, and Mappers

2. **Client-Server Architecture** (Unselected - Located in `Unselected/` directory) - 2-tier architecture
   - **Status**: Unselected architecture (for comparison)
   - **Location**: `Unselected/fitness-backend/fitness-tracker-backend/`
   - Controllers directly access repositories

Both architectures serve the same fitness tracking application but with different internal organization and design principles. The frontend code is shared and works with both architectures.


### Client-Server vs. Layered Architecture: Rationale for Our Final Choice

For our FitTrack application, the Client-Server and Layered architectures both use the same React frontend and PostgreSQL database, but the way they organize the backend is completely different. The Client-Server setup is more straightforward—controllers talk directly to repositories. It works for quick prototypes, but everything ends up mixed together: HTTP handling, business rules, and database operations all live in the same place, and it can even expose full entities (including sensitive fields) back to the client. The Layered architecture, on the other hand, breaks the system into four clear layers—Controllers, Services, Repositories/Mappers, and Entities/DTOs. This structure keeps responsibilities separate: controllers handle requests, services hold all the business logic, repositories handle database access, and DTOs make sure we only return safe, clean data to the frontend. For a real fitness app like FitTrack that deals with user accounts, workouts, goals, and personal progress over time, that separation really matters. It gives us stronger security, cleaner code, and room to grow the app in the future without breaking anything. That's why we chose the Layered architecture as our final implementation and kept the Client-Server version strictly for comparison.

### Why We Did Not Use Event-Based Architecture

In our original project proposal, we planned to use Event-Based Architecture as one of our candidate styles. After deeper analysis, we replaced it with the Layered Architecture because EBA uses asynchronous events and a message broker to link different parts of the system, which can be great for big, distributed applications. Once we compared that approach to what FitTrack actually needs, it became clear it was not the best choice. Here’s why:

**1. Complexity vs. Requirements Mismatch:**
- Event-Based Architecture introduces a lot of additional components such as event brokers, event schemas, and versioning. It also brings challenges like eventual consistency. FitTrack’s workflows are simple and synchronous. Users log workouts, set goals, and expect immediate feedback. An event-driven system would have made the application more complex without providing real benefits for our use case.

**2. Synchronous User Interactions:**
- Fitness tracking is highly interactive. When a user submits a workout, they expect to see updated statistics right away. Because EBA is asynchronous, it cannot guarantee immediate updates without adding complicated workarounds like polling or state synchronization. A standard REST-based approach gives users the instant feedback they expect.

**3. Development and Maintenance Overhead:**
- Using EBA would have required extra infrastructure such as message brokers, monitoring tools, and advanced debugging workflows. We would also need to handle event ordering, retries, and idempotency. For a team project with limited time, this overhead would slow down development. The Layered Architecture gives us the structure we need without adding unnecessary complexity.

**4. Data Consistency Requirements:**
- Accuracy is important in a fitness app. When a user completes a workout, their progress needs to update right away. Event-Based Architecture relies on eventual consistency, which means updates might not appear instantly. Our Layered Architecture uses transactional services, so data updates happen immediately and remain consistent.

**5. Team Size and Project Scope:**
- Event-Based Architecture shines when multiple services or teams need to coordinate across a distributed environment. FitTrack is a single, centralized application. The Layered Architecture already provides clear separation of concerns without the overhead of asynchronous events.

**6. Testing and Debugging:**
- Testing event-driven systems requires setting up brokers and simulating asynchronous flows. Debugging long event chains can also be challenging. With the Layered Architecture, we can write straightforward unit tests for services, mock repositories, and test our entire request-response cycle without dealing with asynchronous behavior.

**Conclusion:**
While Event-Based Architecture is powerful for systems requiring high scalability, complex workflows, and integration with multiple external systems, our fitness tracking application benefits more from the clear structure, immediate consistency, and straightforward development model that Layered Architecture provides. The Layered architecture gives us the separation of concerns we need without the operational complexity that would slow down development and maintenance.

---

## 1. Client-Server Architecture

### Description

The Client-Server architecture is a distributed system architecture that separates the application into two distinct tiers:

- **Client Tier**: React-based frontend application running in the browser
- **Server Tier**: Spring Boot backend application running on a server
- **Database Tier**: PostgreSQL database for persistent data storage

The architecture follows a 2-tier model where the client communicates directly with the server via HTTP/REST API, and the server manages all data persistence through a database.

### Structure

```
┌─────────────────┐         HTTP/REST          ┌─────────────────┐         JDBC/JPA         ┌──────────────┐
│                 │ ◄─────────────────────────► │                 │ ◄─────────────────────► │              │
│  React Client   │      (JSON payloads)        │  Spring Boot    │    (SQL queries)        │  PostgreSQL  │
│  (Port 3000+)   │                             │  Server         │                         │  Database    │
│                 │                             │  (Port 8080)    │                         │              │
└─────────────────┘                             └─────────────────┘                         └──────────────┘
```

### Components

**Client Tier:**
- React components for UI rendering (`src/components/`)
- API service layer (`src/services/api.ts`) for HTTP communication
- State management using React hooks

**Server Tier:**
- REST Controllers (`controller/`) - Handle HTTP requests/responses
- Repositories (`repository/`) - Data access layer using Spring Data JPA
- Entity Models (`model/`) - Domain objects mapped to database tables

**Database Tier:**
- PostgreSQL database with tables: `users`, `workouts`, `goals`, `exercises`

### Connectors

1. **HTTP/REST Connector** (Client ↔ Server)
   - **Implementation**: RESTful API using JSON
   - **Client side**: `fetch()` API in `src/services/api.ts`
   - **Server side**: `@RestController` with `@CrossOrigin` for CORS
   - **Endpoints**: `/api/users`, `/api/workouts`, `/api/goals`
   - **Methods**: GET, POST, PUT, DELETE

2. **JPA/Hibernate Connector** (Repository ↔ Database)
   - **Implementation**: Spring Data JPA with Hibernate ORM
   - **Protocol**: JDBC
   - **Auto-generated**: CRUD methods via `JpaRepository` interface

### Benefits

1- **Separation of Concerns**: Clear separation between presentation (client) and business logic (server)

2- **Scalability**: Server can handle multiple clients simultaneously

3- **Centralized Data Management**: Single source of truth in the database

4- **Security**: Business logic and sensitive operations are protected on the server

5- **Maintainability**: Changes to client UI don't affect server logic and vice versa

6- **Reusability**: The same REST API can serve web, mobile, or other client applications

### Why we selected it as a style for this application

1. **Fitness tracking requires data persistence**: Users need their workouts, goals, and progress saved across sessions
2. **Multi-user support**: Multiple users can access the system simultaneously with their own data
3. **Security requirements**: User authentication and sensitive data (passwords, personal info) must be handled securely on the server
4. **Real-time data synchronization**: The server ensures all clients see consistent data
5. **Future extensibility**: Easy to add mobile apps or other clients using the same REST API

### Integration

The Client-Server architecture is integrated through:

- **API Service Layer** (`src/services/api.ts`): Centralized HTTP communication functions
  ```typescript
  export const userApi = {
    getAll: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()),
    create: (user: any) => fetch(`${API_BASE_URL}/users`, { method: 'POST', ... })
  }
  ```

- **REST Controllers**: Server-side endpoints that handle requests
  ```java
  @RestController
  @RequestMapping("/api/users")
  public class UserController {
      @Autowired
      private UserRepository userRepository;
      // ... endpoint methods
  }
  ```

- **CORS Configuration**: Enables cross-origin requests from the React client
- **JSON Serialization**: Automatic conversion between JavaScript objects and Java entities

---

## 2. Layered Architecture

### Description

The Layered Architecture organizes the application into distinct horizontal layers, each with specific responsibilities. This architecture separates concerns by creating clear boundaries between presentation, business logic, data access, and data storage layers.

The layered architecture in this application consists of four main layers:

- **Presentation Layer**: REST Controllers that handle HTTP requests and responses
- **Application/Business Logic Layer**: Service interfaces and implementations containing business rules
- **Data Access Layer**: Repositories for database operations and Mappers for entity-DTO conversion
- **Domain/Entity Layer**: Entity classes representing database tables

This architecture provides better separation of concerns compared to the 2-tier Client-Server architecture.

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                           │
│  (Controllers: UserController, WorkoutController, GoalController)│
│  • Handle HTTP requests/responses                               │
│  • Validate input                                               │
│  • Delegate to Service layer                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Application/Business Logic Layer                   │
│  (Services: UserService, WorkoutService, GoalService)          │
│  • Business rules and validation                                │
│  • Transaction management                                      │
│  • Orchestrate data operations                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                            │
│  (Repositories + Mappers)                                       │
│  • Repositories: Database CRUD operations                      │
│  • Mappers: Entity ↔ DTO conversion                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Domain/Entity Layer                          │
│  (Entities: User, Workout, Goal, Exercise)                     │
│  • Database schema representation                              │
│  • JPA annotations for ORM mapping                             │
└─────────────────────────────────────────────────────────────────┘
```

### Components

**Presentation Layer (`controller/` package):**
- `UserController.java` - Handles user-related HTTP endpoints
- `WorkoutController.java` - Handles workout-related HTTP endpoints
- `GoalController.java` - Handles goal-related HTTP endpoints
- **Responsibilities**: HTTP request/response handling, input validation, delegating to services

**Application/Business Logic Layer (`service/` package):**
- Service Interfaces: `UserService.java`, `WorkoutService.java`, `GoalService.java`
- Service Implementations: `UserServiceImpl.java`, `WorkoutServiceImpl.java`, `GoalServiceImpl.java`
- **Responsibilities**: Business logic, validation rules, transaction management, orchestration

**Data Access Layer:**
- **Repositories** (`repository/` package): `UserRepository`, `WorkoutRepository`, `GoalRepository`
  - Extend `JpaRepository` for CRUD operations
  - Custom query methods for specific data retrieval
- **Mappers** (`mapper/` package): `UserMapper`, `WorkoutMapper`, `GoalMapper`, `ExerciseMapper`
  - Convert between Entity objects and DTOs
  - Prevent direct entity exposure to clients
  - Handle nested object mapping

**Domain/Entity Layer (`model/` package):**
- `User.java`, `Workout.java`, `Goal.java`, `Exercise.java`
- JPA entities with database mapping annotations
- Relationships defined via `@OneToMany`, `@ManyToOne`

**Data Transfer Objects (`dto/` package):**
- `UserDTO.java`, `WorkoutDTO.java`, `GoalDTO.java`, `ExerciseDTO.java`
- Lightweight objects for data transfer between layers
- Exclude sensitive information (like passwords in responses)
- Version-independent data contracts

### Data Flow

```
HTTP Request
    ↓
Controller (Presentation Layer)
    • Receives HTTP request
    • Extracts parameters
    • Creates/validates DTOs
    ↓
Service (Business Logic Layer)
    • Executes business rules
    • Validates business constraints
    • Manages transactions
    • Calls Repository and Mapper
    ↓
Repository + Mapper (Data Access Layer)
    • Repository: Queries database
    • Mapper: Converts Entity ↔ DTO
    ↓
Entity (Domain Layer)
    • Represents database record
    ↓
Database (PostgreSQL)
```

### Key Features

1. **Service Layer Abstraction**
   - Controllers depend on service interfaces, not implementations
   - Business logic isolated from HTTP concerns
   - Easy to mock services for testing

2. **DTO Pattern**
   - Entities never exposed directly to clients
   - DTOs provide controlled data exposure
   - Security: Passwords and sensitive data can be excluded
   - API versioning: DTOs can evolve independently of entities

3. **Mapper Pattern**
   - Centralized conversion logic between entities and DTOs
   - Handles complex nested object mappings
   - Prevents circular reference issues
   - Simplifies entity-DTO transformations

4. **Layered Dependencies**
   - Each layer only depends on layers below it
   - Presentation → Application → Data Access → Domain
   - No upward dependencies (dependency inversion)

### Benefits

1- **Separation of Concerns**: Each layer has a single, well-defined responsibility

2- **Maintainability**: Changes to one layer don't affect others (e.g., database changes don't affect controllers)

3- **Testability**: Each layer can be tested independently with mocks
   - Controllers can be tested with mock services
   - Services can be tested with mock repositories
   - No need for database in unit tests

4- **Security**: Sensitive data (passwords) hidden from API responses via DTOs

5- **Flexibility**: Easy to swap implementations (e.g., different database, different service logic)

6- **Scalability**: Business logic can be optimized independently of presentation layer

7- **Code Reusability**: Services can be reused by different controllers or other interfaces

### Why we selected it as a style for this applicationn

1. **Production-ready architecture**: Suitable for real-world applications with complex business logic
2. **Security requirements**: DTOs prevent exposing sensitive user data (passwords) in API responses
3. **Testability**: Service layer can be unit tested without database, improving test coverage
4. **Maintainability**: Clear layer boundaries make code easier to understand and modify
5. **Business logic complexity**: As the application grows, business rules can be centralized in services
6. **Team collaboration**: Different developers can work on different layers simultaneously
7. **Future-proofing**: Easy to add new features, change database, or add new interfaces (e.g., GraphQL)

### Integration

**Layer-to-Layer Communication:**

1. **Controller → Service**
   ```java
   @RestController
   public class UserController {
       private final UserService userService;  // Dependency injection
       
       @GetMapping("/{id}")
       public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
           return userService.getUserById(id)  // Delegates to service
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
       }
   }
   ```

2. **Service → Repository + Mapper**
   ```java
   @Service
   public class UserServiceImpl implements UserService {
       private final UserRepository userRepository;
       private final UserMapper userMapper;
       
       public UserDTO getUserById(Long id) {
           return userRepository.findById(id)
               .map(userMapper::toDTO)  // Entity → DTO conversion
               .orElse(null);
       }
   }
   ```

3. **Repository → Entity → Database**
   ```java
   public interface UserRepository extends JpaRepository<User, Long> {
       Optional<User> findByUsername(String username);
   }
   ```

4. **Mapper: Entity ↔ DTO**
   ```java
   @Component
   public class UserMapper {
       public UserDTO toDTO(User user) {
           // Convert entity to DTO, excluding sensitive data
           UserDTO dto = new UserDTO();
           dto.setId(user.getId());
           dto.setUsername(user.getUsername());
           // Password intentionally excluded
           return dto;
       }
       
       public User toEntity(UserDTO dto) {
           // Convert DTO to entity
           User user = new User();
           user.setUsername(dto.getUsername());
           // ... map other fields
           return user;
       }
   }
   ```

**Cross-Layer Flow Example:**
```
Client Request → Controller → Service → Repository → Database
                                    ↓
Client Response ← DTO ← Mapper ← Entity ←────────────┘
```

---

## Differences Between Architectural Styles

| Aspect | Client-Server Architecture (main branch) | Layered Architecture (layered-architecture branch) |
|--------|----------------------------------------|--------------------------------------------------|
| **Tiers/Layers** | 2-Tier (Client ↔ Server ↔ Database) | 4-Layer (Presentation → Service → Data Access → Domain) |
| **Service Layer** | None - Controllers directly access repositories | Yes - Business logic in service layer |
| **DTOs** | None - Entities exposed directly | Yes - DTOs used for data transfer |
| **Mappers** | None - No entity-DTO conversion | Yes - Mappers convert Entity ↔ DTO |
| **Controllers** | Contains business logic | Only HTTP handling, delegates to services |
| **Security** | Passwords exposed in JSON responses | Passwords hidden via DTOs |
| **Testability** | Hard - Requires database for testing | Easy - Services can be mocked |
| **Complexity** | Simple - Fewer layers, less code | More complex - More layers, more code |
| **Coupling** | Tight - Controllers depend on repositories | Loose - Controllers depend on service interfaces |
| **Transaction Management** | Manual in controllers | Managed in service layer with `@Transactional` |
| **Best For** | Prototypes, simple apps, rapid development | Production apps, complex business logic |
| **Development Speed** | Faster initial development | Slower initial setup, faster long-term maintenance |

### Relationship

These two architectural styles represent different approaches to organizing the same application:

- **Client-Server Architecture** (unselected): Simpler 2-tier approach where controllers directly access repositories. Good for rapid prototyping and simple applications.

- **Layered Architecture** (selected): More structured 4-layer approach with clear separation of concerns. Better for production applications with complex business logic.

Both architectures:
- Use the same React frontend
- Communicate via HTTP/REST
- Use the same PostgreSQL database
- Follow the same domain model (User, Workout, Goal, Exercise)

The key difference is in the **server-side organization**: Client-Server has controllers directly calling repositories, while Layered Architecture introduces service and mapper layers between controllers and repositories.

---

## Functionalities

### Client-Server Architecture Functionalities

1. **Request-Response Communication**
   - Client sends HTTP requests to server
   - Server processes requests and returns JSON responses
   - Asynchronous communication allows non-blocking UI

2. **Data Synchronization**
   - Server maintains authoritative data state
   - All clients receive consistent data
   - Changes propagate from server to clients

3. **Authentication & Authorization**
   - Server validates user credentials
   - Session management handled on server
   - Protected endpoints enforce access control

4. **Error Handling**
   - Server returns appropriate HTTP status codes
   - Client handles errors gracefully
   - Network failures are detected and reported

5. **CORS Management**
   - Server configured to accept requests from client origin
   - Enables secure cross-origin communication

### Layered Architecture Functionalities

1. **Request Processing Flow**
   - HTTP request received by Controller (Presentation Layer)
   - Controller validates input and creates DTOs
   - Controller delegates to Service (Business Logic Layer)
   - Service executes business rules and validation
   - Service calls Repository and Mapper (Data Access Layer)
   - Repository queries database using Entities (Domain Layer)
   - Mapper converts Entity to DTO
   - DTO returned through layers to Controller
   - Controller returns JSON response to client

2. **Business Logic Encapsulation**
   - All business rules centralized in Service layer
   - Controllers contain no business logic
   - Services can be reused by multiple controllers
   - Business logic can be tested independently

3. **Data Transformation**
   - Entities converted to DTOs before sending to client
   - DTOs converted to Entities before saving to database
   - Mappers handle complex nested object conversions
   - Sensitive data (passwords) excluded from DTOs

4. **Transaction Management**
   - Services manage transactions with `@Transactional`
   - Multiple repository operations in single transaction
   - Automatic rollback on exceptions
   - Consistent data state across operations

5. **Security & Data Protection**
   - Passwords never exposed in API responses
   - DTOs provide controlled data exposure
   - Entities remain internal to server
   - Input validation at controller and service layers

6. **Testability**
   - Controllers tested with mock services
   - Services tested with mock repositories
   - No database required for unit tests
   - Integration tests verify full layer interaction

---

## Technology Stack

### Frontend (Client)
- **React 18**: UI framework with component-based architecture
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and development server
- **Radix UI**: Accessible component library
- **Fetch API**: HTTP communication

### Backend (Server)

**Layered Architecture (Selected - `Selected/` directory):**
- **Spring Boot 3**: REST API framework
- **Spring Data JPA**: Repository pattern implementation
- **Spring Service Layer**: Business logic layer with `@Service` and `@Transactional`
- **DTO Pattern**: Data Transfer Objects for API contracts
- **Mapper Pattern**: Entity-DTO conversion layer
- **Hibernate**: ORM for database mapping
- **PostgreSQL**: Relational database
- **Java**: Server-side programming language

**Client-Server Architecture (Unselected - `Unselected/` directory):**
- **Spring Boot 3**: REST API framework
- **Spring Data JPA**: Repository pattern implementation
- **Hibernate**: ORM for database mapping
- **PostgreSQL**: Relational database
- **Java**: Server-side programming language

### Communication
- **HTTP/HTTPS**: Network protocol
- **REST**: Architectural style for API design
- **JSON**: Data interchange format
- **CORS**: Cross-origin resource sharing

---

## Architecture Diagrams

Detailed architecture diagrams are available in the `docs/` directory:

**Client-Server Architecture :**
- `component-diagram-client-server.puml`: System-level component diagram
- `class-diagram-client-server.puml`: Class-level structure diagram
- `component-to-class-mapping-client-server.puml`: Component to implementation mapping

**Layered Architecture :**
- `component-diagram.puml`: Layered architecture component diagram
- `class-diagram.puml`: Class-level structure with services and DTOs
- `component-to-class-mapping.puml`: Component to implementation mapping

See `docs/README.md` for instructions on viewing these PlantUML diagrams.

---

## Key Design Decisions

### Client-Server Architecture

1. **2-Tier Architecture**: No intermediate service layer for simplicity and faster development
2. **Direct Entity Exposure**: Entities returned directly to client (no DTOs) for rapid prototyping
3. **Repository Pattern**: Spring Data JPA provides clean data access abstraction
4. **Component-Based UI**: React components enable reusable, maintainable UI code
5. **RESTful API**: Standard HTTP methods for predictable API design
6. **JSON Communication**: Lightweight, human-readable data format

### Layered Architecture

1. **4-Layer Separation**: Clear boundaries between presentation, business logic, data access, and domain layers
2. **Service Layer**: Business logic centralized in service implementations
3. **DTO Pattern**: Data Transfer Objects prevent entity exposure and improve security
4. **Mapper Pattern**: Centralized conversion logic between entities and DTOs
5. **Dependency Injection**: Constructor injection for better testability
6. **Transaction Management**: `@Transactional` annotations in service layer

---

## Directory Structure

This repository contains two implementations of the same fitness tracking application, organized in separate directories:

- **`Selected/` directory**: Implements **Layered Architecture** (4-layer) - **SELECTED FOR FINAL IMPLEMENTATION**
  - Location: `Selected/fitness-backend/fitness-tracker-backend/`
  - Controllers → Services → Repositories → Entities
  - DTOs and Mappers for data transformation
  - Production-ready, better separation of concerns
  - Contains: `service/`, `dto/`, `mapper/` packages

- **`Unselected/` directory**: Implements **Client-Server Architecture** (2-tier) - **UNSELECTED ARCHITECTURE**
  - Location: `Unselected/fitness-backend/fitness-tracker-backend/`
  - Controllers directly access repositories
  - Entities exposed directly to clients
  - Simpler, faster for prototyping
  - Does NOT contain: `service/`, `dto/`, `mapper/` packages

**Frontend**: Shared React application at the root level (`src/`, `package.json`, etc.) - works with both architectures.

To run a specific architecture, navigate to the appropriate directory:
```bash
# For Layered Architecture (Selected)
cd Selected/fitness-backend/fitness-tracker-backend
./gradlew bootRun

# For Client-Server Architecture (Unselected)
cd Unselected/fitness-backend/fitness-tracker-backend
./gradlew bootRun
```

---

## Important Notes for TAs and Evaluators

### Critical Configuration Points

1. **Backend Port:** The backend runs on port **8081** (configured in `application.properties` as `server.port=8081`). The frontend is already configured to connect to this port.

2. **Password Handling:** 
   - If your PostgreSQL password contains special characters (`!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, etc.), you MUST use the environment variable approach
   - Edit `start-backend.ps1` with your password, or set `$env:DB_PASSWORD` before running `gradlew.bat bootRun`
   - Passwords with special characters will NOT work if placed directly in `application.properties`

3. **Test Configuration:** 
   - You MUST create `src/test/resources/application.properties` with the same database configuration
   - Tests will fail with "no password was provided" error if this file is missing

4. **Database Setup:**
   - Database name must be `fitnessdb`
   - Tables are automatically created on first backend startup (due to `create-drop` mode)
   - If you see connection errors, verify PostgreSQL service is running

5. **Startup Order:**
   - Start PostgreSQL (usually runs as service)
   - Start Backend (Terminal 1)
   - Start Frontend (Terminal 2)
   - Access at http://localhost:3000

### Verification Checklist

After setup, verify:
- [ ] PostgreSQL service is running
- [ ] Database `fitnessdb` exists
- [ ] Backend starts without errors on port 8081
- [ ] Frontend starts without errors on port 3000
- [ ] Can access http://localhost:3000 in browser
- [ ] Can create a user account without "Failed to fetch" error
- [ ] Backend API responds at http://localhost:8081/api/users

---

## Future Enhancements

Potential improvements for both architectures:

- Add authentication tokens (JWT) for stateless sessions
- Implement caching layer for performance
- Add WebSocket support for real-time updates
- Introduce API versioning for backward compatibility
- Add comprehensive unit and integration tests
- Implement API documentation with OpenAPI/Swagger
- Add request/response logging and monitoring
