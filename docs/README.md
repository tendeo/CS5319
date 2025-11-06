# Architecture Diagrams - PlantUML

This directory contains PlantUML diagrams for the CS5319-3 Layered Architecture implementation.

## Diagrams

### 1. Component Diagram (`component-diagram.puml`)
Shows the Level 2 architecture with components and connectors:
- **Presentation Layer**: REST Controllers
- **Business Logic Layer**: Services
- **Data Mapping Layer**: Mappers & DTOs
- **Data Access Layer**: Repositories & Entities
- **Database Layer**: PostgreSQL tables

**Connectors**:
- HTTP requests
- Service calls
- Mapper conversions
- Repository operations
- Database CRUD

### 2. Class Diagram (`class-diagram.puml`)
Shows all classes and their associations:
- **Controllers**: UserController, WorkoutController, GoalController
- **Services**: UserService, WorkoutService, GoalService (interfaces + implementations)
- **DTOs**: UserDTO, WorkoutDTO, GoalDTO, ExerciseDTO
- **Mappers**: UserMapper, WorkoutMapper, GoalMapper, ExerciseMapper
- **Repositories**: UserRepository, WorkoutRepository, GoalRepository
- **Entities**: User, Workout, Goal, Exercise

**Associations**:
- Controller → Service
- Service → Repository
- Service → Mapper
- Mapper ↔ Entity/DTO
- Entity relationships (User has Workouts and Goals, etc.)

### 3. Component-to-Class Mapping (`component-to-class-mapping.puml`)
Maps each component/connector to its implementing classes:
- Component definitions
- Implementation class mappings
- Connector implementations
- Design patterns used

## How to Use

### Online Viewers

1. **PlantUML Online Editor**
   - Visit: http://www.plantuml.com/plantuml/uml/
   - Copy the content of any `.puml` file
   - Paste and view the diagram

2. **PlantText**
   - Visit: https://www.planttext.com/
   - Copy the content of any `.puml` file
   - Paste and generate the diagram

### VS Code Extension

1. Install the "PlantUML" extension
2. Open any `.puml` file
3. Press `Alt+D` (or `Option+D` on Mac) to preview

### Command Line (macOS/Linux)

```bash
# Install PlantUML
brew install plantuml

# Generate PNG image
plantuml component-diagram.puml

# Generate SVG image
plantuml -tsvg component-diagram.puml

# Generate all diagrams
plantuml docs/*.puml
```

### Generate All Diagrams at Once

```bash
cd /Users/colbypapadakis/CS5319-3/docs
plantuml *.puml
```

This will create:
- `component-diagram.png`
- `class-diagram.png`
- `component-to-class-mapping.png`

## Diagram Customization

You can customize the diagrams by:

1. **Colors**: Modify the `skinparam` sections
2. **Layout**: Add `left to right direction` at the top
3. **Notes**: Add additional `note` blocks
4. **Hide/Show**: Use `hide` or `show` keywords

Example customizations:

```plantuml
' Change direction
left to right direction

' Hide class members
hide members

' Show only public members
hide private members

' Custom colors
skinparam class {
    BackgroundColor LightBlue
    BorderColor Navy
}
```

## Integration with Documentation

These diagrams support the architecture documentation in:
- `README.md` - Architecture overview
- `ARCHITECTURE.md` - Detailed layer descriptions
- `COMPARISON.md` - Comparison with previous architecture

## Key Architecture Principles Shown

1. **Layered Architecture**: Clear separation of concerns
2. **Dependency Injection**: Constructor-based injection throughout
3. **Interface Segregation**: Services define clear contracts
4. **Single Responsibility**: Each class has one purpose
5. **DTO Pattern**: Data transfer without exposing entities
6. **Repository Pattern**: Data access abstraction
7. **Mapper Pattern**: Object transformation layer

## File Structure

```
docs/
├── README.md                        # This file
├── component-diagram.puml           # Level 2 architecture
├── class-diagram.puml               # All classes and associations
└── component-to-class-mapping.puml  # Component → Class mapping
```

## Presentation Tips

For slides/presentations:

1. **Slide 1**: Use `component-diagram.puml`
   - Shows high-level architecture
   - Clear layer separation
   - Component responsibilities

2. **Slide 2**: Use `class-diagram.puml`
   - Shows implementation details
   - Class relationships
   - Design patterns

3. **Slide 3**: Use `component-to-class-mapping.puml`
   - Shows traceability
   - Component implementations
   - Connector details

## Export Formats

PlantUML supports multiple export formats:

- **PNG**: Raster image (default)
- **SVG**: Vector image (scalable)
- **EPS**: Encapsulated PostScript
- **PDF**: Portable Document Format
- **VDX**: Microsoft Visio
- **LaTeX**: LaTeX compatible

```bash
plantuml -tsvg component-diagram.puml   # SVG
plantuml -tpdf component-diagram.puml   # PDF
plantuml -teps component-diagram.puml   # EPS
```

## Additional Resources

- [PlantUML Official Site](https://plantuml.com/)
- [PlantUML Language Reference](https://plantuml.com/guide)
- [Component Diagram Syntax](https://plantuml.com/component-diagram)
- [Class Diagram Syntax](https://plantuml.com/class-diagram)

