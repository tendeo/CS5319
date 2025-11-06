# Client-Server Architecture Diagrams - PlantUML

This directory contains PlantUML diagrams for the CS5319-2 Client-Server Architecture implementation.

## Diagrams

### 1. Component Diagram (`component-diagram-client-server.puml`)
**Slide 1: Components and Connectors**

Shows the Level 2 client-server architecture with:
- **Client Tier**: React Frontend
- **Server Tier**: Spring Boot with Controllers, Repositories, Entities
- **Database Tier**: PostgreSQL

**Connectors**:
- HTTP/REST (Client ↔ Server)
- Direct Repository Access (Controller ↔ Repository)
- JPA/Hibernate (Repository ↔ Database)

### 2. Class Diagram (`class-diagram-client-server.puml`)
**Slide 2: Classes and Associations**

Shows all implementation classes:
- **Controllers**: UserController, WorkoutController, GoalController
- **Repositories**: UserRepository, WorkoutRepository, GoalRepository
- **Entities**: User, Workout, Goal, Exercise
- **Configuration**: SecurityConfig, CorsConfig

**Associations**:
- Controller → Repository (direct dependency)
- Repository → Entity (manages)
- Entity → Entity (relationships: User has Workouts/Goals, etc.)

### 3. Component-to-Class Mapping (`component-to-class-mapping-client-server.puml`)
**Slide 3: Component → Class Mapping**

Maps each component/connector to its implementing classes:
- Client Frontend → React components + api.ts
- Controllers → Controller classes
- Repositories → Repository interfaces
- Entities → Entity classes
- Connectors → Implementation details (HTTP, DI, JPA)

## Key Characteristics of Client-Server Architecture

### Architecture Pattern
- **2-Tier**: Client ↔ Server ↔ Database
- **No Service Layer**: Controllers directly access repositories
- **No DTOs**: Entities exposed directly to client
- **Direct Access**: Simple, straightforward communication

### Pros
✅ Simple and easy to understand  
✅ Fewer layers = less code  
✅ Faster initial development  
✅ Good for prototypes  

### Cons
❌ Controllers contain business logic  
❌ Tight coupling (Controller ↔ Repository)  
❌ Security issues (passwords exposed)  
❌ Hard to test (need database)  
❌ Not scalable for complex applications  

## How to Use

### Online Viewers (Recommended)

1. **PlantText**
   - Visit: https://www.planttext.com/
   - Copy the content of any `.puml` file
   - Paste and click "Refresh"

2. **PlantUML Online Editor**
   - Visit: http://www.plantuml.com/plantuml/uml/
   - Copy and paste the content

### VS Code Extension

1. Install "PlantUML" extension
2. Open any `.puml` file
3. Press `Alt+D` (Windows/Linux) or `Option+D` (Mac)

### Command Line

```bash
# Install PlantUML
brew install plantuml

# Generate PNG images
cd /Users/colbypapadakis/CS5319-2/docs
plantuml *.puml

# Generate SVG images
plantuml -tsvg *.puml
```

## Presentation Structure

For a 3-slide presentation:

**Slide 1** - Component Diagram:
- Client-Server-Database tiers
- HTTP REST connector
- Direct repository access
- No service layer

**Slide 2** - Class Diagram:
- All controller classes
- All repository interfaces
- All entity classes
- Direct relationships (no DTOs)

**Slide 3** - Component-to-Class Mapping:
- Component definitions
- Implementation mappings
- Connector implementations
- Design patterns (Repository, MVC, DI)

## Comparison with Layered Architecture (CS5319-3)

| Aspect | Client-Server (CS5319-2) | Layered (CS5319-3) |
|--------|--------------------------|-------------------|
| **Tiers** | 2-Tier | 4-Layer |
| **Service Layer** | ❌ None | ✅ Yes |
| **DTOs** | ❌ None | ✅ Yes |
| **Mappers** | ❌ None | ✅ Yes |
| **Controllers** | Business logic included | Only HTTP handling |
| **Security** | ❌ Passwords exposed | ✅ Passwords hidden |
| **Testability** | 🟡 Hard | ✅ Easy |
| **Complexity** | Simple | More complex |
| **Best For** | Prototypes, simple apps | Production apps |

## File Structure

```
docs/
├── README.md                                    # This file
├── component-diagram-client-server.puml         # Slide 1
├── class-diagram-client-server.puml             # Slide 2
└── component-to-class-mapping-client-server.puml # Slide 3
```

## Technologies Shown

### Client
- React 18
- Vite build tool
- Radix UI components
- fetch API for HTTP requests

### Server
- Spring Boot 3
- Spring MVC (@RestController)
- Spring Data JPA (repositories)
- Hibernate ORM

### Database
- PostgreSQL
- JDBC connection
- Foreign key constraints

## Connector Details

### 1. HTTP Connector (Client → Server)
**Implementation**: REST API
- **Client side**: `fetch()` in `api.ts`
- **Server side**: `@RestController` + `@CrossOrigin`
- **Format**: JSON
- **Endpoints**: `/api/users`, `/api/workouts`, `/api/goals`

### 2. Repository Connector (Controller → Repository)
**Implementation**: Spring Dependency Injection
- **Pattern**: `@Autowired private Repository`
- **Type**: Direct field injection
- **Coupling**: Tight (controller depends on concrete repository)

### 3. JPA Connector (Repository → Database)
**Implementation**: Spring Data JPA
- **Interface**: `extends JpaRepository<Entity, ID>`
- **ORM**: Hibernate
- **Protocol**: JDBC
- **Auto-generated**: CRUD methods by Spring

## Export Formats

PlantUML supports multiple formats:

```bash
plantuml -tpng component-diagram-client-server.puml   # PNG
plantuml -tsvg component-diagram-client-server.puml   # SVG
plantuml -tpdf component-diagram-client-server.puml   # PDF
plantuml -teps component-diagram-client-server.puml   # EPS
```

## Additional Resources

- [PlantUML Component Diagrams](https://plantuml.com/component-diagram)
- [PlantUML Class Diagrams](https://plantuml.com/class-diagram)
- [Spring Boot Architecture](https://spring.io/projects/spring-boot)
- [Client-Server Architecture Pattern](https://en.wikipedia.org/wiki/Client%E2%80%93server_model)

