# Fitness Tracking App - Layered Architecture

This project is a refactored version of the Fitness Tracking App implementing a **Layered Architecture** pattern for better separation of concerns, maintainability, and scalability.

## Architecture Overview

This application follows a **4-Layer Architecture** pattern:

```
┌─────────────────────────────────────┐
│     Presentation Layer (API)        │  ← Controllers
├─────────────────────────────────────┤
│     Business Logic Layer            │  ← Services
├─────────────────────────────────────┤
│     Data Mapping Layer              │  ← Mappers & DTOs
├─────────────────────────────────────┤
│     Data Access Layer               │  ← Repositories & Entities
└─────────────────────────────────────┘
         ↓
    [Database]
```

## Layer Descriptions

### 1. Presentation Layer (Controllers)
**Location**: `controller/` package

**Responsibility**: 
- Handle HTTP requests and responses
- Input validation
- Delegate business logic to services
- Return appropriate HTTP status codes

**Key Classes**:
- `UserController` - User management endpoints
- `WorkoutController` - Workout management endpoints
- `GoalController` - Goal management endpoints

**Example**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

### 2. Business Logic Layer (Services)
**Location**: `service/` package

**Responsibility**:
- Implement business rules and logic
- Transaction management
- Coordinate between different repositories
- Data validation and processing

**Key Interfaces & Implementations**:
- `UserService` / `UserServiceImpl`
- `WorkoutService` / `WorkoutServiceImpl`
- `GoalService` / `GoalServiceImpl`

**Example**:
```java
@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
}
```

### 3. Data Mapping Layer (DTOs & Mappers)
**Location**: `dto/` and `mapper/` packages

**Responsibility**:
- Define Data Transfer Objects (DTOs) for data exchange
- Convert between entities and DTOs
- Prevent exposure of sensitive data (e.g., passwords)
- Avoid circular reference issues

**Key Classes**:
- **DTOs**: `UserDTO`, `WorkoutDTO`, `GoalDTO`, `ExerciseDTO`
- **Mappers**: `UserMapper`, `WorkoutMapper`, `GoalMapper`, `ExerciseMapper`

**Example**:
```java
@Component
public class UserMapper {
    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        // Note: password is NOT included for security
        return dto;
    }
}
```

### 4. Data Access Layer (Repositories & Entities)
**Location**: `repository/` and `model/` packages

**Responsibility**:
- Database operations (CRUD)
- Entity definitions with JPA annotations
- Custom queries

**Key Classes**:
- **Entities**: `User`, `Workout`, `Goal`, `Exercise`
- **Repositories**: `UserRepository`, `WorkoutRepository`, `GoalRepository`

**Example**:
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "user")
    private List<Workout> workouts;
}
```

## Benefits of Layered Architecture

### 1. Separation of Concerns
- Each layer has a single, well-defined responsibility
- Changes in one layer don't affect others

### 2. Maintainability
- Easier to locate and fix bugs
- Clearer code organization
- Better team collaboration

### 3. Testability
- Each layer can be tested independently
- Easy to mock dependencies
- Better unit test coverage

### 4. Security
- DTOs prevent exposure of sensitive data
- Business logic is centralized in services
- Password fields excluded from DTOs

### 5. Scalability
- Easy to add new features
- Can replace implementations without affecting other layers
- Better support for microservices migration

### 6. Flexibility
- Can change database without affecting business logic
- Can add caching at service layer
- Easy to add new endpoints

## Data Flow Example

Here's how a user creation request flows through the layers:

```
1. Client sends POST request
        ↓
2. UserController receives request (Presentation Layer)
        ↓
3. Controller creates UserDTO from request
        ↓
4. Controller calls UserService.createUser() (Business Logic Layer)
        ↓
5. UserService validates business rules
        ↓
6. UserMapper converts UserDTO to User entity (Mapping Layer)
        ↓
7. UserRepository saves entity to database (Data Access Layer)
        ↓
8. UserMapper converts saved entity back to UserDTO
        ↓
9. UserService returns UserDTO
        ↓
10. Controller returns HTTP response with UserDTO
```

## Key Architectural Principles Applied

### 1. Dependency Injection
All components use constructor-based dependency injection:
```java
public UserController(UserService userService) {
    this.userService = userService;
}
```

### 2. Interface Segregation
Services define clear interfaces:
```java
public interface UserService {
    List<UserDTO> getAllUsers();
    Optional<UserDTO> getUserById(Long id);
    UserDTO createUser(UserDTO userDTO);
    // ...
}
```

### 3. Single Responsibility Principle
Each class has one reason to change:
- Controllers: HTTP concerns
- Services: Business logic
- Repositories: Data access
- Mappers: Data transformation

### 4. Open/Closed Principle
Easy to extend without modifying existing code:
- Add new endpoints → Add controller methods
- Add business rules → Modify service
- Add database operations → Extend repository

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL
- **ORM**: Hibernate/JPA
- **Build Tool**: Gradle

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Hooks

## Project Structure

```
fitness-backend/fitness-tracker-backend/
├── src/main/java/com/example/fitness_tracker_backend/
│   ├── controller/          # Presentation Layer
│   │   ├── UserController.java
│   │   ├── WorkoutController.java
│   │   └── GoalController.java
│   ├── service/             # Business Logic Layer
│   │   ├── UserService.java
│   │   ├── UserServiceImpl.java
│   │   ├── WorkoutService.java
│   │   ├── WorkoutServiceImpl.java
│   │   ├── GoalService.java
│   │   └── GoalServiceImpl.java
│   ├── dto/                 # Data Transfer Objects
│   │   ├── UserDTO.java
│   │   ├── WorkoutDTO.java
│   │   ├── GoalDTO.java
│   │   └── ExerciseDTO.java
│   ├── mapper/              # Entity-DTO Mappers
│   │   ├── UserMapper.java
│   │   ├── WorkoutMapper.java
│   │   ├── GoalMapper.java
│   │   └── ExerciseMapper.java
│   ├── repository/          # Data Access Layer
│   │   ├── UserRepository.java
│   │   ├── WorkoutRepository.java
│   │   └── GoalRepository.java
│   ├── model/               # JPA Entities
│   │   ├── User.java
│   │   ├── Workout.java
│   │   ├── Goal.java
│   │   └── Exercise.java
│   └── config/              # Configuration
│       ├── SecurityConfig.java
│       └── CorsConfig.java
└── src/main/resources/
    └── application.properties

src/                         # Frontend
├── components/
├── services/
│   └── api.ts              # API client
└── App.tsx
```

## Running the Application

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. **Configure Database**:
   Edit `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/fitnessdb
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. **Run Backend**:
   ```bash
   cd fitness-backend/fitness-tracker-backend
   ./gradlew bootRun
   ```
   Backend runs on: `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Frontend**:
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:3000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/{id}` - Get workout by ID
- `GET /api/workouts/user/{userId}` - Get workouts by user
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/{id}` - Get goal by ID
- `GET /api/goals/user/{userId}` - Get goals by user
- `POST /api/goals` - Create goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal
- `PATCH /api/goals/{id}/progress` - Update goal progress

## Comparison with Previous Architecture

### Before (Direct Repository Access)
```java
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;  // Direct dependency
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);  // Returns entity
    }
}
```

**Issues**:
- Controllers tightly coupled to repositories
- No separation of business logic
- Entities exposed directly to clients
- Hard to test
- Security concerns (password exposure)

### After (Layered Architecture)
```java
@RestController
public class UserController {
    private final UserService userService;  // Service dependency
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.getUserById(id)  // Returns DTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
```

**Benefits**:
- Loose coupling
- Business logic in service layer
- DTOs protect sensitive data
- Easy to test (mock service)
- Better error handling

## Testing Strategy

### Unit Tests
```java
@Test
public void testCreateUser() {
    // Arrange
    UserDTO userDTO = new UserDTO();
    when(userRepository.save(any())).thenReturn(user);
    
    // Act
    UserDTO result = userService.createUser(userDTO);
    
    // Assert
    assertNotNull(result);
}
```

### Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetUser() throws Exception {
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").exists());
    }
}
```

## Future Enhancements

1. **Add Exception Handling Layer**
   - Global exception handler
   - Custom exceptions
   - Better error responses

2. **Add Validation Layer**
   - Input validation with Bean Validation
   - Custom validators

3. **Add Caching**
   - Redis integration
   - Cache at service layer

4. **Add Authentication/Authorization**
   - JWT tokens
   - Role-based access control

5. **Add API Documentation**
   - Swagger/OpenAPI
   - Auto-generated docs

## References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Layered Architecture Pattern](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## License

This project is for educational purposes.

## Original Project

The original project is available at: https://www.figma.com/design/DMTfRyrCyVnqEhyw4Vj5Er/Fitness-Tracking-App-Wireframes
