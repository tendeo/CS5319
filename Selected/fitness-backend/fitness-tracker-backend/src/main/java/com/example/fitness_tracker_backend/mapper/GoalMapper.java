package com.example.fitness_tracker_backend.mapper;

import com.example.fitness_tracker_backend.dto.GoalDTO;
import com.example.fitness_tracker_backend.model.Goal;
import org.springframework.stereotype.Component;

/**
 * Mapper class to convert between Goal entity and GoalDTO
 * Part of the Data Mapping Layer
 */
@Component
public class GoalMapper {

    /**
     * Converts Goal entity to GoalDTO
     * @param goal the Goal entity
     * @return GoalDTO
     */
    public GoalDTO toDTO(Goal goal) {
        if (goal == null) {
            return null;
        }

        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setTargetDate(goal.getTargetDate());
        dto.setStartDate(goal.getStartDate());
        dto.setStatus(goal.getStatus());
        dto.setCategory(goal.getCategory());
        dto.setTargetValue(goal.getTargetValue());
        dto.setUnit(goal.getUnit());
        dto.setCurrentValue(goal.getCurrentValue());

        if (goal.getUser() != null) {
            dto.setUserId(goal.getUser().getId());
        }

        return dto;
    }

    /**
     * Converts GoalDTO to Goal entity
     * @param dto the GoalDTO
     * @return Goal entity
     */
    public Goal toEntity(GoalDTO dto) {
        if (dto == null) {
            return null;
        }

        Goal goal = new Goal();
        goal.setId(dto.getId());
        goal.setTitle(dto.getTitle());
        goal.setDescription(dto.getDescription());
        goal.setTargetDate(dto.getTargetDate());
        goal.setStartDate(dto.getStartDate());
        goal.setStatus(dto.getStatus());
        goal.setCategory(dto.getCategory());
        goal.setTargetValue(dto.getTargetValue());
        goal.setUnit(dto.getUnit());
        goal.setCurrentValue(dto.getCurrentValue());

        return goal;
    }

    /**
     * Simplified DTO without nested objects to avoid circular references
     */
    public GoalDTO toSimpleDTO(Goal goal) {
        return toDTO(goal); // Goal doesn't have nested objects, so same as toDTO
    }
}

