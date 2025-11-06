package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.dto.GoalDTO;
import com.example.fitness_tracker_backend.service.GoalService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Goal operations (Presentation Layer)
 * Delegates business logic to GoalService
 */
@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    /**
     * Get all goals
     */
    @GetMapping
    public List<GoalDTO> getAllGoals() {
        return goalService.getAllGoals();
    }

    /**
     * Get goal by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get goals by user ID
     */
    @GetMapping("/user/{userId}")
    public List<GoalDTO> getGoalsByUserId(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    /**
     * Create a new goal
     */
    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody JsonNode requestBody) {
        try {
            GoalDTO goalDTO = new GoalDTO();
            goalDTO.setTitle(requestBody.get("title").asText());
            
            if (requestBody.has("description")) {
                goalDTO.setDescription(requestBody.get("description").asText());
            }
            
            if (requestBody.has("targetDate")) {
                goalDTO.setTargetDate(LocalDate.parse(requestBody.get("targetDate").asText()));
            }
            
            if (requestBody.has("startDate")) {
                goalDTO.setStartDate(LocalDate.parse(requestBody.get("startDate").asText()));
            }
            
            if (requestBody.has("status")) {
                goalDTO.setStatus(requestBody.get("status").asText());
            } else {
                goalDTO.setStatus("active");
            }
            
            if (requestBody.has("category")) {
                goalDTO.setCategory(requestBody.get("category").asText());
            }
            
            if (requestBody.has("targetValue")) {
                goalDTO.setTargetValue(requestBody.get("targetValue").asDouble());
            }
            
            if (requestBody.has("currentValue")) {
                goalDTO.setCurrentValue(requestBody.get("currentValue").asDouble());
            } else {
                goalDTO.setCurrentValue(0.0);
            }
            
            if (requestBody.has("unit")) {
                goalDTO.setUnit(requestBody.get("unit").asText());
            }
            
            // Set user ID
            if (requestBody.has("userId")) {
                Long userId = requestBody.get("userId").asLong();
                goalDTO.setUserId(userId);
            }
            
            GoalDTO savedGoal = goalService.createGoal(goalDTO);
            return ResponseEntity.ok(savedGoal);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update goal
     */
    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long id, @RequestBody GoalDTO goalDTO) {
        try {
            GoalDTO updatedGoal = goalService.updateGoal(id, goalDTO);
            return ResponseEntity.ok(updatedGoal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete goal
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        try {
            goalService.deleteGoal(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update goal progress
     */
    @PatchMapping("/{id}/progress")
    public ResponseEntity<GoalDTO> updateGoalProgress(
            @PathVariable Long id,
            @RequestBody JsonNode requestBody) {
        try {
            Double currentValue = requestBody.get("currentValue").asDouble();
            GoalDTO updatedGoal = goalService.updateGoalProgress(id, currentValue);
            return ResponseEntity.ok(updatedGoal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
