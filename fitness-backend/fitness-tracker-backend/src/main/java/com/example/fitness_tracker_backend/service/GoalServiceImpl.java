package com.example.fitness_tracker_backend.service;

import com.example.fitness_tracker_backend.dto.GoalDTO;
import com.example.fitness_tracker_backend.mapper.GoalMapper;
import com.example.fitness_tracker_backend.model.Goal;
import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.repository.GoalRepository;
import com.example.fitness_tracker_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of GoalService interface
 * Part of the Business Logic Layer
 */
@Service
@Transactional
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final GoalMapper goalMapper;

    public GoalServiceImpl(GoalRepository goalRepository, 
                          UserRepository userRepository,
                          GoalMapper goalMapper) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.goalMapper = goalMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getAllGoals() {
        return goalRepository.findAll().stream()
                .map(goalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GoalDTO> getGoalById(Long id) {
        return goalRepository.findById(id)
                .map(goalMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId).stream()
                .map(goalMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GoalDTO createGoal(GoalDTO goalDTO) {
        Goal goal = goalMapper.toEntity(goalDTO);
        
        // Set user if userId is provided
        if (goalDTO.getUserId() != null) {
            User user = userRepository.findById(goalDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + goalDTO.getUserId()));
            goal.setUser(user);
        }

        Goal savedGoal = goalRepository.save(goal);
        return goalMapper.toDTO(savedGoal);
    }

    @Override
    public GoalDTO updateGoal(Long id, GoalDTO goalDTO) {
        Goal existingGoal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        // Update fields
        existingGoal.setTitle(goalDTO.getTitle());
        existingGoal.setDescription(goalDTO.getDescription());
        existingGoal.setTargetDate(goalDTO.getTargetDate());
        existingGoal.setStartDate(goalDTO.getStartDate());
        existingGoal.setStatus(goalDTO.getStatus());
        existingGoal.setCategory(goalDTO.getCategory());
        existingGoal.setTargetValue(goalDTO.getTargetValue());
        existingGoal.setUnit(goalDTO.getUnit());
        existingGoal.setCurrentValue(goalDTO.getCurrentValue());

        Goal updatedGoal = goalRepository.save(existingGoal);
        return goalMapper.toDTO(updatedGoal);
    }

    @Override
    public void deleteGoal(Long id) {
        if (!goalRepository.existsById(id)) {
            throw new RuntimeException("Goal not found with id: " + id);
        }
        goalRepository.deleteById(id);
    }

    @Override
    public GoalDTO updateGoalProgress(Long id, Double currentValue) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + id));

        goal.setCurrentValue(currentValue);

        // Auto-complete goal if target is reached
        if (goal.getTargetValue() != null && currentValue >= goal.getTargetValue()) {
            goal.setStatus("completed");
        }

        Goal updatedGoal = goalRepository.save(goal);
        return goalMapper.toDTO(updatedGoal);
    }
}

