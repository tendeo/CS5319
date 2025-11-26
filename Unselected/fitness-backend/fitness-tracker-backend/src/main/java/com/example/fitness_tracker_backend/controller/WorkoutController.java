package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.model.Workout;
import com.example.fitness_tracker_backend.repository.WorkoutRepository;
import com.example.fitness_tracker_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class WorkoutController {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Optional<Workout> workout = workoutRepository.findById(id);
        return workout.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Workout> getWorkoutsByUserId(@PathVariable Long userId) {
        return workoutRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody JsonNode requestBody) {
        try {
            System.out.println("Received workout request: " + requestBody.toString());
            
            Workout workout = new Workout();
            workout.setName(requestBody.get("name").asText());
            
            if (requestBody.has("description")) {
                workout.setDescription(requestBody.get("description").asText());
            }
            
            if (requestBody.has("type")) {
                workout.setType(requestBody.get("type").asText());
            }
            
            if (requestBody.has("duration")) {
                workout.setDuration(requestBody.get("duration").asInt());
            }
            
            if (requestBody.has("caloriesBurned")) {
                workout.setCaloriesBurned(requestBody.get("caloriesBurned").asInt());
            }
            
            // Parse startTime
            if (requestBody.has("startTime")) {
                String startTimeStr = requestBody.get("startTime").asText();
                System.out.println("Parsing startTime: " + startTimeStr);
                // Remove timezone indicator if present (Z or +00:00)
                if (startTimeStr.endsWith("Z")) {
                    startTimeStr = startTimeStr.substring(0, startTimeStr.length() - 1);
                }
                workout.setStartTime(LocalDateTime.parse(startTimeStr));
            } else {
                workout.setStartTime(LocalDateTime.now());
            }
            
            // Set user relationship
            if (requestBody.has("userId")) {
                Long userId = requestBody.get("userId").asLong();
                System.out.println("Looking for user with ID: " + userId);
                Optional<User> userOptional = userRepository.findById(userId);
                if (userOptional.isPresent()) {
                    workout.setUser(userOptional.get());
                    System.out.println("User found and set");
                } else {
                    System.err.println("User not found with ID: " + userId);
                    return ResponseEntity.badRequest().build();
                }
            }
            
            Workout savedWorkout = workoutRepository.save(workout);
            System.out.println("Workout saved successfully with ID: " + savedWorkout.getId());
            return ResponseEntity.ok(savedWorkout);
        } catch (Exception e) {
            System.err.println("Error creating workout: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @RequestBody Workout workoutDetails) {
        Optional<Workout> workoutOptional = workoutRepository.findById(id);
        if (workoutOptional.isPresent()) {
            Workout workout = workoutOptional.get();
            workout.setName(workoutDetails.getName());
            workout.setDescription(workoutDetails.getDescription());
            workout.setStartTime(workoutDetails.getStartTime());
            workout.setEndTime(workoutDetails.getEndTime());
            workout.setDuration(workoutDetails.getDuration());
            workout.setType(workoutDetails.getType());
            workout.setCaloriesBurned(workoutDetails.getCaloriesBurned());
            
            Workout updatedWorkout = workoutRepository.save(workout);
            return ResponseEntity.ok(updatedWorkout);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        if (workoutRepository.existsById(id)) {
            workoutRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/type/{type}")
    public List<Workout> getWorkoutsByUserAndType(@PathVariable Long userId, @PathVariable String type) {
        return workoutRepository.findByUserIdAndType(userId, type);
    }

    @GetMapping("/user/{userId}/date-range")
    public List<Workout> getWorkoutsByDateRange(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return workoutRepository.findByUserIdAndStartTimeBetween(userId, start, end);
    }
}