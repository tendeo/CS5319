package com.example.fitness_tracker_backend.dto;

import java.time.LocalDate;

/**
 * Data Transfer Object for Goal entity
 * Used to transfer goal data between layers
 */
public class GoalDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate targetDate;
    private LocalDate startDate;
    private String status; // active, completed, paused, cancelled
    private String category; // weight_loss, muscle_gain, endurance, flexibility, etc.
    private Double targetValue;
    private String unit; // lbs, minutes, reps, etc.
    private Double currentValue;
    private Long userId;

    // Constructors
    public GoalDTO() {}

    public GoalDTO(Long id, String title, LocalDate targetDate) {
        this.id = id;
        this.title = title;
        this.targetDate = targetDate;
        this.status = "active";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(Double targetValue) {
        this.targetValue = targetValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Double currentValue) {
        this.currentValue = currentValue;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

