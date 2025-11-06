package com.example.fitness_tracker_backend.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object for User entity
 * Used to transfer user data between layers without exposing sensitive information
 */
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // Note: password is intentionally excluded for security
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private Double height; // in cm
    private Double weight; // in kg
    private String fitnessLevel; // beginner, intermediate, advanced
    private List<WorkoutDTO> workouts;
    private List<GoalDTO> goals;

    // Constructors
    public UserDTO() {}

    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getFitnessLevel() {
        return fitnessLevel;
    }

    public void setFitnessLevel(String fitnessLevel) {
        this.fitnessLevel = fitnessLevel;
    }

    public List<WorkoutDTO> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(List<WorkoutDTO> workouts) {
        this.workouts = workouts;
    }

    public List<GoalDTO> getGoals() {
        return goals;
    }

    public void setGoals(List<GoalDTO> goals) {
        this.goals = goals;
    }
}

