package com.example.fitness_tracker_backend.mapper;

import com.example.fitness_tracker_backend.dto.WorkoutDTO;
import com.example.fitness_tracker_backend.model.Workout;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Mapper class to convert between Workout entity and WorkoutDTO
 * Part of the Data Mapping Layer
 */
@Component
public class WorkoutMapper {

    private final ExerciseMapper exerciseMapper;

    public WorkoutMapper(ExerciseMapper exerciseMapper) {
        this.exerciseMapper = exerciseMapper;
    }

    /**
     * Converts Workout entity to WorkoutDTO
     * @param workout the Workout entity
     * @return WorkoutDTO
     */
    public WorkoutDTO toDTO(Workout workout) {
        if (workout == null) {
            return null;
        }

        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(workout.getId());
        dto.setName(workout.getName());
        dto.setDescription(workout.getDescription());
        dto.setStartTime(workout.getStartTime());
        dto.setEndTime(workout.getEndTime());
        dto.setDuration(workout.getDuration());
        dto.setType(workout.getType());
        dto.setCaloriesBurned(workout.getCaloriesBurned());

        if (workout.getUser() != null) {
            dto.setUserId(workout.getUser().getId());
        }

        if (workout.getExercises() != null) {
            dto.setExercises(workout.getExercises().stream()
                    .map(exerciseMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * Converts WorkoutDTO to Workout entity
     * @param dto the WorkoutDTO
     * @return Workout entity
     */
    public Workout toEntity(WorkoutDTO dto) {
        if (dto == null) {
            return null;
        }

        Workout workout = new Workout();
        workout.setId(dto.getId());
        workout.setName(dto.getName());
        workout.setDescription(dto.getDescription());
        workout.setStartTime(dto.getStartTime());
        workout.setEndTime(dto.getEndTime());
        workout.setDuration(dto.getDuration());
        workout.setType(dto.getType());
        workout.setCaloriesBurned(dto.getCaloriesBurned());

        return workout;
    }

    /**
     * Simplified DTO without nested objects to avoid circular references
     */
    public WorkoutDTO toSimpleDTO(Workout workout) {
        if (workout == null) {
            return null;
        }

        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(workout.getId());
        dto.setName(workout.getName());
        dto.setDescription(workout.getDescription());
        dto.setStartTime(workout.getStartTime());
        dto.setEndTime(workout.getEndTime());
        dto.setDuration(workout.getDuration());
        dto.setType(workout.getType());
        dto.setCaloriesBurned(workout.getCaloriesBurned());

        if (workout.getUser() != null) {
            dto.setUserId(workout.getUser().getId());
        }

        return dto;
    }
}

