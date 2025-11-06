package com.example.fitness_tracker_backend.service;

import com.example.fitness_tracker_backend.dto.WorkoutDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Workout business logic
 * Part of the Business Logic Layer
 */
public interface WorkoutService {
    
    /**
     * Get all workouts
     * @return List of WorkoutDTOs
     */
    List<WorkoutDTO> getAllWorkouts();
    
    /**
     * Get workout by ID
     * @param id Workout ID
     * @return Optional WorkoutDTO
     */
    Optional<WorkoutDTO> getWorkoutById(Long id);
    
    /**
     * Get workouts by user ID
     * @param userId User ID
     * @return List of WorkoutDTOs
     */
    List<WorkoutDTO> getWorkoutsByUserId(Long userId);
    
    /**
     * Create a new workout
     * @param workoutDTO Workout data
     * @return Created WorkoutDTO
     */
    WorkoutDTO createWorkout(WorkoutDTO workoutDTO);
    
    /**
     * Update existing workout
     * @param id Workout ID
     * @param workoutDTO Updated workout data
     * @return Updated WorkoutDTO
     */
    WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO);
    
    /**
     * Delete workout
     * @param id Workout ID
     */
    void deleteWorkout(Long id);
}

