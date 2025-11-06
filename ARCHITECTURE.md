# Layered Architecture - Detailed Documentation

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                    React + Vite Frontend                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Controllers)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │User          │  │Workout       │  │Goal          │      │
│  │Controller    │  │Controller    │  │Controller    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         │ Uses DTOs        │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│           BUSINESS LOGIC LAYER (Services)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │UserService   │  │WorkoutService│  │GoalService   │      │
│  │Impl          │  │Impl          │  │Impl          │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         │ Business Rules   │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│           DATA MAPPING LAYER (Mappers & DTOs)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │UserMapper    │  │WorkoutMapper │  │GoalMapper    │      │
│  │              │  │              │  │              │      │
│  │UserDTO  ←→   │  │WorkoutDTO ←→ │  │GoalDTO  ←→   │      │
│  │User Entity   │  │Workout Entity│  │Goal Entity   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│         DATA ACCESS LAYER (Repositories & Entities)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │User          │  │Workout       │  │Goal          │      │
│  │Repository    │  │Repository    │  │Repository    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         │ JPA/Hibernate    │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                   │
│              [Users] [Workouts] [Goals] [Exercises]          │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow Sequence

### Example: Create New Workout

```
User Action → HTTP POST /api/workouts
    ↓
1. WorkoutController.createWorkout()
   - Receives JsonNode request body
   - Validates input
   - Creates WorkoutDTO from request
    ↓
2. WorkoutService.createWorkout(WorkoutDTO)
   - Applies business rules
   - Validates user exists
    ↓
3. WorkoutMapper.toEntity(WorkoutDTO)
   - Converts DTO to Entity
   - Maps fields
    ↓
4. WorkoutRepository.save(Workout)
   - Persists to database
   - Returns saved entity
    ↓
5. WorkoutMapper.toDTO(Workout)
   - Converts entity to DTO
   - Excludes sensitive data
    ↓
6. Return WorkoutDTO to Controller
    ↓
7. Controller returns HTTP 200 with WorkoutDTO
    ↓
Response sent to client
```

## Layer Responsibilities

### 1. Presentation Layer
**Package**: `controller`

**What it does**:
- Receives HTTP requests
- Validates request format
- Calls appropriate service methods
- Converts service responses to HTTP responses
- Handles HTTP status codes

**What it does NOT do**:
- ❌ Direct database access
- ❌ Business logic
- ❌ Data transformation logic
- ❌ Entity manipulation

**Dependencies**:
- Services (UserService, WorkoutService, GoalService)

### 2. Business Logic Layer
**Package**: `service`

**What it does**:
- Implements business rules
- Orchestrates multiple repository calls
- Manages transactions
- Validates business constraints
- Coordinates data flow

**What it does NOT do**:
- ❌ HTTP concerns
- ❌ Direct entity-DTO conversion (delegates to mappers)
- ❌ Database queries (delegates to repositories)

**Dependencies**:
- Repositories (for data access)
- Mappers (for entity-DTO conversion)

### 3. Data Mapping Layer
**Package**: `dto` and `mapper`

**What it does**:
- Defines DTOs for data transfer
- Converts Entities ↔ DTOs
- Prevents circular references
- Excludes sensitive fields
- Provides simplified DTOs when needed

**What it does NOT do**:
- ❌ Business logic
- ❌ Database operations
- ❌ HTTP handling

**Dependencies**:
- Entities (read-only for mapping)

### 4. Data Access Layer
**Package**: `repository` and `model`

**What it does**:
- Defines database schema (entities)
- CRUD operations
- Custom queries
- Relationship management

**What it does NOT do**:
- ❌ Business logic
- ❌ DTO conversion
- ❌ HTTP handling

**Dependencies**:
- Spring Data JPA
- Database

## Component Interaction Matrix

| Component | Can Call → | Cannot Call |
|-----------|-----------|-------------|
| Controller | Service, DTO | Repository, Entity, Mapper |
| Service | Repository, Mapper, DTO | Controller |
| Mapper | Entity, DTO | Repository, Service, Controller |
| Repository | Entity | Controller, Service, Mapper, DTO |

## Design Patterns Used

### 1. Dependency Injection Pattern
```java
// Constructor-based injection
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```

### 2. Repository Pattern
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
```

### 3. DTO Pattern
```java
// Prevents exposing entity details
public class UserDTO {
    private Long id;
    private String username;
    // password field intentionally excluded
}
```

### 4. Mapper Pattern
```java
@Component
public class UserMapper {
    public UserDTO toDTO(User user) { /* ... */ }
    public User toEntity(UserDTO dto) { /* ... */ }
}
```

### 5. Service Layer Pattern
```java
@Service
@Transactional
public class UserServiceImpl implements UserService {
    // Business logic centralized here
}
```

### 6. Interface Segregation
```java
public interface UserService {
    // Clear contract for user operations
    List<UserDTO> getAllUsers();
    Optional<UserDTO> getUserById(Long id);
    // ...
}
```

## Data Flow Patterns

### Pattern 1: Simple Read Operation
```
Controller → Service → Repository → Database
                ↓
            Mapper (Entity → DTO)
                ↓
          Return DTO
```

### Pattern 2: Create Operation
```
Controller (receives JSON)
    ↓
Create DTO from request
    ↓
Service (business validation)
    ↓
Mapper (DTO → Entity)
    ↓
Repository (save)
    ↓
Mapper (Entity → DTO)
    ↓
Return DTO to client
```

### Pattern 3: Complex Operation with Multiple Entities
```
Controller
    ↓
Service (orchestrates multiple operations)
    ├─→ UserRepository.findById()
    ├─→ WorkoutMapper.toEntity()
    ├─→ WorkoutRepository.save()
    └─→ WorkoutMapper.toDTO()
    ↓
Return combined DTO
```

## Error Handling Strategy

### Layer-Specific Error Handling

**Controller Layer**:
```java
try {
    UserDTO user = userService.createUser(userDTO);
    return ResponseEntity.ok(user);
} catch (RuntimeException e) {
    return ResponseEntity.badRequest().build();
}
```

**Service Layer**:
```java
@Override
public UserDTO updateUser(Long id, UserDTO userDTO) {
    User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    // ... update logic
}
```

**Repository Layer**:
```java
// Spring Data JPA handles database exceptions
```

## Transaction Management

### Service Layer Transactions
```java
@Service
@Transactional  // Class-level transaction
public class UserServiceImpl implements UserService {
    
    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // All operations in this method are transactional
        // Rollback on exception
    }
    
    @Override
    @Transactional(readOnly = true)  // Optimization for read
    public List<UserDTO> getAllUsers() {
        // Read-only transaction
    }
}
```

## Security Considerations

### 1. Password Protection
DTOs exclude password field:
```java
public class UserDTO {
    // password field NOT included
    private String username;
    private String email;
}
```

### 2. Input Validation
Controllers validate input before passing to services.

### 3. SQL Injection Prevention
Using JPA/Hibernate prevents SQL injection.

### 4. CORS Configuration
Configured in `CorsConfig.java` for allowed origins.

## Performance Optimizations

### 1. Read-Only Transactions
```java
@Transactional(readOnly = true)
public List<UserDTO> getAllUsers() {
    // Optimized for read operations
}
```

### 2. Lazy Loading
```java
@OneToMany(fetch = FetchType.LAZY)
private List<Workout> workouts;
```

### 3. Simplified DTOs
```java
// For nested objects, use simplified version
public UserDTO toSimpleDTO(User user) {
    // Excludes nested collections
}
```

## Testing Strategy per Layer

### Controller Tests (Integration)
```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetUser() throws Exception {
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk());
    }
}
```

### Service Tests (Unit)
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    void testCreateUser() {
        // Test business logic
    }
}
```

### Repository Tests (Integration)
```java
@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testFindByUsername() {
        // Test database operations
    }
}
```

### Mapper Tests (Unit)
```java
class UserMapperTest {
    @Test
    void testToDTO() {
        // Test entity to DTO conversion
    }
}
```

## Migration from Old Architecture

### Before (Monolithic Controllers)
```java
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        // Business logic mixed with controller
        if (user.getEmail() == null) {
            throw new RuntimeException("Email required");
        }
        return userRepository.save(user);
    }
}
```

### After (Layered Architecture)
```java
@RestController
public class UserController {
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        // Delegates to service
        UserDTO created = userService.createUser(userDTO);
        return ResponseEntity.ok(created);
    }
}

@Service
public class UserServiceImpl implements UserService {
    public UserDTO createUser(UserDTO userDTO) {
        // Business logic here
        validateEmail(userDTO.getEmail());
        // ...
    }
}
```

## Advantages Summary

| Aspect | Benefit |
|--------|---------|
| **Maintainability** | Each layer is independent and focused |
| **Testability** | Easy to mock and test each layer |
| **Security** | DTOs prevent data leakage |
| **Scalability** | Easy to add features without breaking existing code |
| **Reusability** | Services can be used by multiple controllers |
| **Performance** | Transaction management at service layer |
| **Flexibility** | Easy to switch implementations |
| **Team Collaboration** | Clear boundaries for different teams |

## Common Pitfalls to Avoid

1. ❌ **Don't skip layers**
   - Controllers should NOT call repositories directly
   - Services should NOT handle HTTP concerns

2. ❌ **Don't expose entities**
   - Always use DTOs for API responses
   - Never return JPA entities from controllers

3. ❌ **Don't put business logic in controllers**
   - Keep controllers thin
   - Business logic belongs in services

4. ❌ **Don't create circular dependencies**
   - Use simplified DTOs to break cycles
   - Be careful with bidirectional relationships

5. ❌ **Don't mix concerns**
   - Each layer should have one responsibility
   - Don't put database code in services

## Conclusion

This layered architecture provides a solid foundation for:
- Long-term maintainability
- Team scalability
- Feature extensibility
- Testing efficiency
- Security best practices

The clear separation of concerns makes it easy to understand, modify, and extend the application as requirements evolve.

