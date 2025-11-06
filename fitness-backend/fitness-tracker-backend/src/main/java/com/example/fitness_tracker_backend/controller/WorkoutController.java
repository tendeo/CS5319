package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.dto.WorkoutDTO;
import com.example.fitness_tracker_backend.service.WorkoutService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for Workout operations (Presentation Layer)
 * Delegates business logic to WorkoutService
 */
@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    /**
     * Get all workouts
     */
    @GetMapping
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutService.getAllWorkouts();
    }

    /**
     * Get workout by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDTO> getWorkoutById(@PathVariable Long id) {
        return workoutService.getWorkoutById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get workouts by user ID
     */
    @GetMapping("/user/{userId}")
    public List<WorkoutDTO> getWorkoutsByUserId(@PathVariable Long userId) {
        return workoutService.getWorkoutsByUserId(userId);
    }

    /**
     * Create a new workout
     */
    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(@RequestBody JsonNode requestBody) {
        try {
            System.out.println("Received workout request: " + requestBody.toString());
            
            WorkoutDTO workoutDTO = new WorkoutDTO();
            workoutDTO.setName(requestBody.get("name").asText());
            
            if (requestBody.has("description")) {
                workoutDTO.setDescription(requestBody.get("description").asText());
            }
            
            if (requestBody.has("type")) {
                workoutDTO.setType(requestBody.get("type").asText());
            }
            
            if (requestBody.has("duration")) {
                workoutDTO.setDuration(requestBody.get("duration").asInt());
            }
            
            if (requestBody.has("caloriesBurned")) {
                workoutDTO.setCaloriesBurned(requestBody.get("caloriesBurned").asInt());
            }
            
            // Parse startTime
            if (requestBody.has("startTime")) {
                String startTimeStr = requestBody.get("startTime").asText();
                System.out.println("Parsing startTime: " + startTimeStr);
                if (startTimeStr.endsWith("Z")) {
                    startTimeStr = startTimeStr.substring(0, startTimeStr.length() - 1);
                }
                workoutDTO.setStartTime(LocalDateTime.parse(startTimeStr));
            } else {
                workoutDTO.setStartTime(LocalDateTime.now());
            }
            
            // Set user ID
            if (requestBody.has("userId")) {
                Long userId = requestBody.get("userId").asLong();
                System.out.println("Setting userId: " + userId);
                workoutDTO.setUserId(userId);
            }
            
            WorkoutDTO savedWorkout = workoutService.createWorkout(workoutDTO);
            System.out.println("Workout saved successfully with ID: " + savedWorkout.getId());
            return ResponseEntity.ok(savedWorkout);
            
        } catch (Exception e) {
            System.err.println("Error creating workout: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update workout
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDTO> updateWorkout(@PathVariable Long id, @RequestBody WorkoutDTO workoutDTO) {
        try {
            WorkoutDTO updatedWorkout = workoutService.updateWorkout(id, workoutDTO);
            return ResponseEntity.ok(updatedWorkout);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete workout
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        try {
            workoutService.deleteWorkout(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
