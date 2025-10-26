package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.Workout;
import com.example.fitness_tracker_backend.repository.WorkoutRepository;
import com.example.fitness_tracker_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:3001")
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
    public Workout createWorkout(@RequestBody Workout workout) {
        return workoutRepository.save(workout);
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