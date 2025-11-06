package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.dto.GoalDTO;
import com.example.fitness_tracker_backend.dto.UserDTO;
import com.example.fitness_tracker_backend.service.GoalService;
import com.example.fitness_tracker_backend.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * REST Controller for User operations (Presentation Layer)
 * Delegates business logic to UserService
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class UserController {

    private final UserService userService;
    private final GoalService goalService;

    public UserController(UserService userService, GoalService goalService) {
        this.userService = userService;
        this.goalService = goalService;
    }

    /**
     * Get all users
     */
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get user by username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new user
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody JsonNode requestBody) {
        try {
            // Create UserDTO from request
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(requestBody.get("username").asText());
            userDTO.setEmail(requestBody.get("email").asText());
            
            if (requestBody.has("firstName")) {
                userDTO.setFirstName(requestBody.get("firstName").asText());
            }
            if (requestBody.has("lastName")) {
                userDTO.setLastName(requestBody.get("lastName").asText());
            }
            if (requestBody.has("dateOfBirth") && !requestBody.get("dateOfBirth").isNull()) {
                userDTO.setDateOfBirth(LocalDate.parse(requestBody.get("dateOfBirth").asText()));
            }
            if (requestBody.has("gender")) {
                userDTO.setGender(requestBody.get("gender").asText());
            }
            if (requestBody.has("height") && !requestBody.get("height").isNull()) {
                userDTO.setHeight(requestBody.get("height").asDouble());
            }
            if (requestBody.has("weight") && !requestBody.get("weight").isNull()) {
                userDTO.setWeight(requestBody.get("weight").asDouble());
            }
            if (requestBody.has("fitnessLevel")) {
                userDTO.setFitnessLevel(requestBody.get("fitnessLevel").asText());
            }
            
            // Create user through service
            UserDTO createdUser = userService.createUser(userDTO);
            
            // Handle goals separately through GoalService
            if (requestBody.has("goals") && requestBody.get("goals").isArray()) {
                List<GoalDTO> goals = new ArrayList<>();
                LocalDate defaultTargetDate = LocalDate.now().plusMonths(3);
                
                for (JsonNode goalNode : requestBody.get("goals")) {
                    GoalDTO goalDTO = new GoalDTO();
                    
                    String category = goalNode.get("category").asText();
                    String goalName = goalNode.get("goal").asText();
                    String metric = goalNode.get("metric").asText();
                    
                    goalDTO.setTitle(goalName);
                    goalDTO.setDescription(metric);
                    goalDTO.setCategory(category);
                    goalDTO.setStatus("active");
                    goalDTO.setStartDate(LocalDate.now());
                    goalDTO.setTargetDate(defaultTargetDate);
                    goalDTO.setTargetValue(100.0);
                    goalDTO.setCurrentValue(0.0);
                    goalDTO.setUnit("%");
                    goalDTO.setUserId(createdUser.getId());
                    
                    goalService.createGoal(goalDTO);
                }
            }
            
            // Fetch complete user with goals
            return userService.getUserById(createdUser.getId())
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.badRequest().build());
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
