package com.example.fitness_tracker_backend.mapper;

import com.example.fitness_tracker_backend.dto.ExerciseDTO;
import com.example.fitness_tracker_backend.model.Exercise;
import org.springframework.stereotype.Component;

/**
 * Mapper class to convert between Exercise entity and ExerciseDTO
 * Part of the Data Mapping Layer
 */
@Component
public class ExerciseMapper {

    /**
     * Converts Exercise entity to ExerciseDTO
     * @param exercise the Exercise entity
     * @return ExerciseDTO
     */
    public ExerciseDTO toDTO(Exercise exercise) {
        if (exercise == null) {
            return null;
        }

        ExerciseDTO dto = new ExerciseDTO();
        dto.setId(exercise.getId());
        dto.setName(exercise.getName());
        dto.setDescription(exercise.getDescription());
        dto.setCategory(exercise.getCategory());
        dto.setSets(exercise.getSets());
        dto.setReps(exercise.getReps());
        dto.setWeight(exercise.getWeight());
        dto.setDuration(exercise.getDuration());
        dto.setRestTime(exercise.getRestTime());

        if (exercise.getWorkout() != null) {
            dto.setWorkoutId(exercise.getWorkout().getId());
        }

        return dto;
    }

    /**
     * Converts ExerciseDTO to Exercise entity
     * @param dto the ExerciseDTO
     * @return Exercise entity
     */
    public Exercise toEntity(ExerciseDTO dto) {
        if (dto == null) {
            return null;
        }

        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setName(dto.getName());
        exercise.setDescription(dto.getDescription());
        exercise.setCategory(dto.getCategory());
        exercise.setSets(dto.getSets());
        exercise.setReps(dto.getReps());
        exercise.setWeight(dto.getWeight());
        exercise.setDuration(dto.getDuration());
        exercise.setRestTime(dto.getRestTime());

        return exercise;
    }
}

