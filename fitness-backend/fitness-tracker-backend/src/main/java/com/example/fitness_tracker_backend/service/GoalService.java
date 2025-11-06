package com.example.fitness_tracker_backend.service;

import com.example.fitness_tracker_backend.dto.GoalDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for Goal business logic
 * Part of the Business Logic Layer
 */
public interface GoalService {
    
    /**
     * Get all goals
     * @return List of GoalDTOs
     */
    List<GoalDTO> getAllGoals();
    
    /**
     * Get goal by ID
     * @param id Goal ID
     * @return Optional GoalDTO
     */
    Optional<GoalDTO> getGoalById(Long id);
    
    /**
     * Get goals by user ID
     * @param userId User ID
     * @return List of GoalDTOs
     */
    List<GoalDTO> getGoalsByUserId(Long userId);
    
    /**
     * Create a new goal
     * @param goalDTO Goal data
     * @return Created GoalDTO
     */
    GoalDTO createGoal(GoalDTO goalDTO);
    
    /**
     * Update existing goal
     * @param id Goal ID
     * @param goalDTO Updated goal data
     * @return Updated GoalDTO
     */
    GoalDTO updateGoal(Long id, GoalDTO goalDTO);
    
    /**
     * Delete goal
     * @param id Goal ID
     */
    void deleteGoal(Long id);
    
    /**
     * Update goal progress
     * @param id Goal ID
     * @param currentValue Current progress value
     * @return Updated GoalDTO
     */
    GoalDTO updateGoalProgress(Long id, Double currentValue);
}

