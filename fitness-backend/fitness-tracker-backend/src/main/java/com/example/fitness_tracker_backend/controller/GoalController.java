package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.Goal;
import com.example.fitness_tracker_backend.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3001")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

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
    public Goal createGoal(@RequestBody Goal goal) {
        return goalRepository.save(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        Optional<Goal> goalOptional = goalRepository.findById(id);
        if (goalOptional.isPresent()) {
            Goal goal = goalOptional.get();
            goal.setTitle(goalDetails.getTitle());
            goal.setDescription(goalDetails.getDescription());
            goal.setTargetDate(goalDetails.getTargetDate());
            goal.setStartDate(goalDetails.getStartDate());
            goal.setStatus(goalDetails.getStatus());
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