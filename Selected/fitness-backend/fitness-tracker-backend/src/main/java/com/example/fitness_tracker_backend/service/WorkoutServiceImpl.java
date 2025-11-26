package com.example.fitness_tracker_backend.service;

import com.example.fitness_tracker_backend.dto.WorkoutDTO;
import com.example.fitness_tracker_backend.mapper.WorkoutMapper;
import com.example.fitness_tracker_backend.model.User;
import com.example.fitness_tracker_backend.model.Workout;
import com.example.fitness_tracker_backend.repository.UserRepository;
import com.example.fitness_tracker_backend.repository.WorkoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of WorkoutService interface
 * Part of the Business Logic Layer
 */
@Service
@Transactional
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final WorkoutMapper workoutMapper;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, 
                             UserRepository userRepository,
                             WorkoutMapper workoutMapper) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.workoutMapper = workoutMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutDTO> getAllWorkouts() {
        return workoutRepository.findAll().stream()
                .map(workoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<WorkoutDTO> getWorkoutById(Long id) {
        return workoutRepository.findById(id)
                .map(workoutMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutDTO> getWorkoutsByUserId(Long userId) {
        return workoutRepository.findByUserId(userId).stream()
                .map(workoutMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO) {
        Workout workout = workoutMapper.toEntity(workoutDTO);
        
        // Set user if userId is provided
        if (workoutDTO.getUserId() != null) {
            User user = userRepository.findById(workoutDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + workoutDTO.getUserId()));
            workout.setUser(user);
        }

        Workout savedWorkout = workoutRepository.save(workout);
        return workoutMapper.toDTO(savedWorkout);
    }

    @Override
    public WorkoutDTO updateWorkout(Long id, WorkoutDTO workoutDTO) {
        Workout existingWorkout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));

        // Update fields
        existingWorkout.setName(workoutDTO.getName());
        existingWorkout.setDescription(workoutDTO.getDescription());
        existingWorkout.setStartTime(workoutDTO.getStartTime());
        existingWorkout.setEndTime(workoutDTO.getEndTime());
        existingWorkout.setDuration(workoutDTO.getDuration());
        existingWorkout.setType(workoutDTO.getType());
        existingWorkout.setCaloriesBurned(workoutDTO.getCaloriesBurned());

        Workout updatedWorkout = workoutRepository.save(existingWorkout);
        return workoutMapper.toDTO(updatedWorkout);
    }

    @Override
    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new RuntimeException("Workout not found with id: " + id);
        }
        workoutRepository.deleteById(id);
    }
}

