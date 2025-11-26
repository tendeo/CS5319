package com.example.fitness_tracker_backend.repository;

import com.example.fitness_tracker_backend.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(Long userId);
    List<Goal> findByUserIdAndStatus(Long userId, String status);
    List<Goal> findByUserIdAndCategory(Long userId, String category);
    boolean existsByUserIdAndStatusIgnoreCaseAndTitleIgnoreCase(Long userId, String status, String title);
    boolean existsByUserIdAndStatusIgnoreCaseAndTitleIgnoreCaseAndIdNot(Long userId, String status, String title, Long id);
}