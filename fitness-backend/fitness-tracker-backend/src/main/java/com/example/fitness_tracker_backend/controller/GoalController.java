package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.Goal;
import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.repository.GoalRepository;
import com.example.fitness_tracker_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable Long id) {
        Optional<Goal> goal = goalRepository.findById(id);
        return goal.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUserId(@PathVariable Long userId) {
        return goalRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public List<Goal> getGoalsByUserAndStatus(@PathVariable Long userId, @PathVariable String status) {
        return goalRepository.findByUserIdAndStatus(userId, status);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public List<Goal> getGoalsByUserAndCategory(@PathVariable Long userId, @PathVariable String category) {
        return goalRepository.findByUserIdAndCategory(userId, category);
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody JsonNode requestBody) {
        try {
            Goal goal = new Goal();
            String title = requestBody.get("title").asText().trim();
            goal.setTitle(title);
            
            if (requestBody.has("description")) {
                goal.setDescription(requestBody.get("description").asText());
            }
            
            if (requestBody.has("targetDate")) {
                goal.setTargetDate(LocalDate.parse(requestBody.get("targetDate").asText()));
            }
            
            if (requestBody.has("startDate")) {
                goal.setStartDate(LocalDate.parse(requestBody.get("startDate").asText()));
            }
            
            String status = requestBody.has("status") && !requestBody.get("status").asText().isBlank()
                    ? requestBody.get("status").asText()
                    : "active";
            goal.setStatus(status);
            
            if (requestBody.has("category")) {
                goal.setCategory(requestBody.get("category").asText());
            }
            
            if (requestBody.has("targetValue")) {
                goal.setTargetValue(requestBody.get("targetValue").asDouble());
            }
            
            if (requestBody.has("currentValue")) {
                goal.setCurrentValue(requestBody.get("currentValue").asDouble());
            }
            
            if (requestBody.has("unit")) {
                goal.setUnit(requestBody.get("unit").asText());
            }
            
            // Set user relationship
            if (requestBody.has("userId")) {
                Long userId = requestBody.get("userId").asLong();
                Optional<User> userOptional = userRepository.findById(userId);
                if (userOptional.isPresent()) {
                    goal.setUser(userOptional.get());
                } else {
                    return ResponseEntity.badRequest().build();
                }
            }

            if (goal.getUser() != null
                    && !goal.getTitle().isEmpty()
                    && "active".equalsIgnoreCase(goal.getStatus())
                    && goalRepository.existsByUserIdAndStatusIgnoreCaseAndTitleIgnoreCase(
                            goal.getUser().getId(),
                            "active",
                            goal.getTitle())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            Goal savedGoal = goalRepository.save(goal);
            return ResponseEntity.ok(savedGoal);
        } catch (IllegalStateException duplicateGoalException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        Optional<Goal> goalOptional = goalRepository.findById(id);
        if (goalOptional.isPresent()) {
            Goal goal = goalOptional.get();
            String updatedTitle = goalDetails.getTitle() != null ? goalDetails.getTitle().trim() : goal.getTitle();
            String updatedStatus = goalDetails.getStatus() != null && !goalDetails.getStatus().isBlank()
                    ? goalDetails.getStatus()
                    : goal.getStatus();

            if (goal.getUser() != null
                    && updatedTitle != null && !updatedTitle.isEmpty()
                    && "active".equalsIgnoreCase(updatedStatus)
                    && goalRepository.existsByUserIdAndStatusIgnoreCaseAndTitleIgnoreCaseAndIdNot(
                            goal.getUser().getId(),
                            "active",
                            updatedTitle,
                            goal.getId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            goal.setTitle(updatedTitle);
            goal.setDescription(goalDetails.getDescription());
            goal.setTargetDate(goalDetails.getTargetDate());
            goal.setStartDate(goalDetails.getStartDate());
            goal.setStatus(updatedStatus);
            goal.setCategory(goalDetails.getCategory());
            goal.setTargetValue(goalDetails.getTargetValue());
            goal.setUnit(goalDetails.getUnit());
            goal.setCurrentValue(goalDetails.getCurrentValue());
            
            Goal updatedGoal = goalRepository.save(goal);
            return ResponseEntity.ok(updatedGoal);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}