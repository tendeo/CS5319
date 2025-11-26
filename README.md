# Fitness Tracking Application

This is a full-stack fitness tracking application built with React (frontend) and Spring Boot (backend). The original project wireframes are available at https://www.figma.com/design/DMTfRyrCyVnqEhyw4Vj5Er/Fitness-Tracking-App-Wireframes.

## Running the Application

### Frontend
Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

### Backend
Navigate to `fitness-backend/fitness-tracker-backend/` and run:
```bash
./gradlew bootRun
```

The backend server runs on `http://localhost:8080` and the frontend on `http://localhost:3000` (or the next available port).

---

## Architectural Styles

This application implements two architectural styles, each available in different branches:

1. **Client-Server Architecture** (Available in `main` branch) - 2-tier architecture
2. **Layered Architecture** (Available in `layered-architecture` branch) - 4-layer architecture

Both architectures serve the same fitness tracking application but with different internal organization and design principles.

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

✅ **Separation of Concerns**: Clear separation between presentation (client) and business logic (server)

✅ **Scalability**: Server can handle multiple clients simultaneously

✅ **Technology Independence**: Client and server can use different technologies (React vs Spring Boot)

✅ **Centralized Data Management**: Single source of truth in the database

✅ **Security**: Business logic and sensitive operations are protected on the server

✅ **Maintainability**: Changes to client UI don't affect server logic and vice versa

✅ **Reusability**: The same REST API can serve web, mobile, or other client applications

### Why Chosen for This Application

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

The Layered Architecture (also known as N-Tier Architecture) organizes the application into distinct horizontal layers, each with specific responsibilities. This architecture separates concerns by creating clear boundaries between presentation, business logic, data access, and data storage layers.

The layered architecture in this application consists of four main layers:

- **Presentation Layer**: REST Controllers that handle HTTP requests and responses
- **Application/Business Logic Layer**: Service interfaces and implementations containing business rules
- **Data Access Layer**: Repositories for database operations and Mappers for entity-DTO conversion
- **Domain/Entity Layer**: Entity classes representing database tables

This architecture is implemented in the `layered-architecture` branch and provides better separation of concerns compared to the 2-tier Client-Server architecture.

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

✅ **Separation of Concerns**: Each layer has a single, well-defined responsibility

✅ **Maintainability**: Changes to one layer don't affect others (e.g., database changes don't affect controllers)

✅ **Testability**: Each layer can be tested independently with mocks
   - Controllers can be tested with mock services
   - Services can be tested with mock repositories
   - No need for database in unit tests

✅ **Security**: Sensitive data (passwords) hidden from API responses via DTOs

✅ **Flexibility**: Easy to swap implementations (e.g., different database, different service logic)

✅ **Scalability**: Business logic can be optimized independently of presentation layer

✅ **Code Reusability**: Services can be reused by different controllers or other interfaces

✅ **Transaction Management**: Services manage transactions across multiple repository calls

### Why Chosen for This Application

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
| **Service Layer** | ❌ None - Controllers directly access repositories | ✅ Yes - Business logic in service layer |
| **DTOs** | ❌ None - Entities exposed directly | ✅ Yes - DTOs used for data transfer |
| **Mappers** | ❌ None - No entity-DTO conversion | ✅ Yes - Mappers convert Entity ↔ DTO |
| **Controllers** | Contains business logic | Only HTTP handling, delegates to services |
| **Security** | ❌ Passwords exposed in JSON responses | ✅ Passwords hidden via DTOs |
| **Testability** | 🟡 Hard - Requires database for testing | ✅ Easy - Services can be mocked |
| **Complexity** | Simple - Fewer layers, less code | More complex - More layers, more code |
| **Coupling** | Tight - Controllers depend on repositories | Loose - Controllers depend on service interfaces |
| **Transaction Management** | Manual in controllers | Managed in service layer with `@Transactional` |
| **Best For** | Prototypes, simple apps, rapid development | Production apps, complex business logic |
| **Development Speed** | Faster initial development | Slower initial setup, faster long-term maintenance |

### Relationship

These two architectural styles represent different approaches to organizing the same application:

- **Client-Server Architecture** (main branch): Simpler 2-tier approach where controllers directly access repositories. Good for rapid prototyping and simple applications.

- **Layered Architecture** (layered-architecture branch): More structured 4-layer approach with clear separation of concerns. Better for production applications with complex business logic.

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

**Client-Server Architecture (main branch):**
- **Spring Boot 3**: REST API framework
- **Spring Data JPA**: Repository pattern implementation
- **Hibernate**: ORM for database mapping
- **PostgreSQL**: Relational database
- **Java**: Server-side programming language

**Layered Architecture (layered-architecture branch):**
- **Spring Boot 3**: REST API framework
- **Spring Data JPA**: Repository pattern implementation
- **Spring Service Layer**: Business logic layer with `@Service` and `@Transactional`
- **DTO Pattern**: Data Transfer Objects for API contracts
- **Mapper Pattern**: Entity-DTO conversion layer
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

**Client-Server Architecture (main branch):**
- `component-diagram-client-server.puml`: System-level component diagram
- `class-diagram-client-server.puml`: Class-level structure diagram
- `component-to-class-mapping-client-server.puml`: Component to implementation mapping

**Layered Architecture (layered-architecture branch):**
- `component-diagram.puml`: Layered architecture component diagram
- `class-diagram.puml`: Class-level structure with services and DTOs
- `component-to-class-mapping.puml`: Component to implementation mapping

See `docs/README.md` for instructions on viewing these PlantUML diagrams.

---

## Key Design Decisions

### Client-Server Architecture (main branch)

1. **2-Tier Architecture**: No intermediate service layer for simplicity and faster development
2. **Direct Entity Exposure**: Entities returned directly to client (no DTOs) for rapid prototyping
3. **Repository Pattern**: Spring Data JPA provides clean data access abstraction
4. **Component-Based UI**: React components enable reusable, maintainable UI code
5. **RESTful API**: Standard HTTP methods for predictable API design
6. **JSON Communication**: Lightweight, human-readable data format

### Layered Architecture (layered-architecture branch)

1. **4-Layer Separation**: Clear boundaries between presentation, business logic, data access, and domain layers
2. **Service Layer**: Business logic centralized in service implementations
3. **DTO Pattern**: Data Transfer Objects prevent entity exposure and improve security
4. **Mapper Pattern**: Centralized conversion logic between entities and DTOs
5. **Dependency Injection**: Constructor injection for better testability
6. **Transaction Management**: `@Transactional` annotations in service layer

---

## Branch Structure

This repository contains two implementations of the same fitness tracking application:

- **`main` branch**: Implements **Client-Server Architecture** (2-tier)
  - Controllers directly access repositories
  - Entities exposed directly to clients
  - Simpler, faster for prototyping

- **`layered-architecture` branch**: Implements **Layered Architecture** (4-layer)
  - Controllers → Services → Repositories → Entities
  - DTOs and Mappers for data transformation
  - Production-ready, better separation of concerns

To switch between architectures:
```bash
git checkout main                    # For Client-Server architecture
git checkout layered-architecture    # For Layered architecture
```

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
