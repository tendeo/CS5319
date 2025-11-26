package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.Goal;
import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody JsonNode requestBody) {
        // Create user from basic fields
        User user = new User();
        user.setUsername(requestBody.get("username").asText());
        user.setEmail(requestBody.get("email").asText());
        user.setPassword(requestBody.get("password").asText());
        
        if (requestBody.has("firstName")) {
            user.setFirstName(requestBody.get("firstName").asText());
        }
        if (requestBody.has("lastName")) {
            user.setLastName(requestBody.get("lastName").asText());
        }
        if (requestBody.has("dateOfBirth") && !requestBody.get("dateOfBirth").isNull()) {
            user.setDateOfBirth(LocalDate.parse(requestBody.get("dateOfBirth").asText()));
        }
        if (requestBody.has("gender")) {
            user.setGender(requestBody.get("gender").asText());
        }
        if (requestBody.has("height") && !requestBody.get("height").isNull()) {
            user.setHeight(requestBody.get("height").asDouble());
        }
        if (requestBody.has("weight") && !requestBody.get("weight").isNull()) {
            user.setWeight(requestBody.get("weight").asDouble());
        }
        if (requestBody.has("fitnessLevel")) {
            user.setFitnessLevel(requestBody.get("fitnessLevel").asText());
        }
        
        // Handle goals array from frontend
        if (requestBody.has("goals") && requestBody.get("goals").isArray()) {
            List<Goal> goals = new ArrayList<>();
            LocalDate defaultTargetDate = LocalDate.now().plusMonths(3); // Default 3 months from now
            
            for (JsonNode goalNode : requestBody.get("goals")) {
                Goal goal = new Goal();
                
                // The frontend sends: {category, goal, metric}
                String category = goalNode.get("category").asText();
                String goalName = goalNode.get("goal").asText();
                String metric = goalNode.get("metric").asText();
                
                goal.setTitle(goalName);
                goal.setDescription(metric);
                goal.setCategory(category);
                goal.setStatus("active");
                goal.setStartDate(LocalDate.now());
                goal.setTargetDate(defaultTargetDate);
                goal.setTargetValue(100.0); // Default target value for percentage calculation
                goal.setCurrentValue(0.0); // Start at 0%
                goal.setUnit("%"); // Progress measured in percentage
                goal.setUser(user);
                
                goals.add(goal);
            }
            
            user.setGoals(goals);
        }
        
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setDateOfBirth(userDetails.getDateOfBirth());
            user.setGender(userDetails.getGender());
            user.setHeight(userDetails.getHeight());
            user.setWeight(userDetails.getWeight());
            user.setFitnessLevel(userDetails.getFitnessLevel());
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}