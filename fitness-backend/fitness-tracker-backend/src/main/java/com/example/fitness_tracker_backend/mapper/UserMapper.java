package com.example.fitness_tracker_backend.mapper;

import com.example.fitness_tracker_backend.dto.UserDTO;
import com.example.fitness_tracker_backend.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Mapper class to convert between User entity and UserDTO
 * Part of the Data Mapping Layer
 */
@Component
public class UserMapper {

    private final WorkoutMapper workoutMapper;
    private final GoalMapper goalMapper;

    public UserMapper(WorkoutMapper workoutMapper, GoalMapper goalMapper) {
        this.workoutMapper = workoutMapper;
        this.goalMapper = goalMapper;
    }

    /**
     * Converts User entity to UserDTO
     * @param user the User entity
     * @return UserDTO
     */
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setHeight(user.getHeight());
        dto.setWeight(user.getWeight());
        dto.setFitnessLevel(user.getFitnessLevel());

        // Convert related entities (avoid circular references by using simplified versions)
        if (user.getWorkouts() != null) {
            dto.setWorkouts(user.getWorkouts().stream()
                    .map(workoutMapper::toSimpleDTO)
                    .collect(Collectors.toList()));
        }

        if (user.getGoals() != null) {
            dto.setGoals(user.getGoals().stream()
                    .map(goalMapper::toSimpleDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * Converts UserDTO to User entity
     * @param dto the UserDTO
     * @return User entity
     */
    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setHeight(dto.getHeight());
        user.setWeight(dto.getWeight());
        user.setFitnessLevel(dto.getFitnessLevel());

        return user;
    }

    /**
     * Simplified DTO without nested objects to avoid circular references
     */
    public UserDTO toSimpleDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setHeight(user.getHeight());
        dto.setWeight(user.getWeight());
        dto.setFitnessLevel(user.getFitnessLevel());

        return dto;
    }
}

