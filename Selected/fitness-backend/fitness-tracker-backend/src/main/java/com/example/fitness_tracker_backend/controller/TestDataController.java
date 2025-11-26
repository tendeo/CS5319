package com.example.fitness_tracker_backend.controller;

import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3001")
public class TestDataController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create-test-user")
    public User createTestUser() {
        // Create a hardcoded test user
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testUser.setGender("Male");
        testUser.setHeight(175.0);
        testUser.setWeight(70.0);
        testUser.setFitnessLevel("intermediate");
        
        return userRepository.save(testUser);
    }

    @GetMapping("/test-connection")
    public String testConnection() {
        return "Backend is working! 🎉";
    }
}