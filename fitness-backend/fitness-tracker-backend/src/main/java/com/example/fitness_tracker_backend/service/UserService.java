package com.example.fitness_tracker_backend.service;

import com.example.fitness_tracker_backend.dto.UserDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for User business logic
 * Part of the Business Logic Layer
 */
public interface UserService {
    
    /**
     * Get all users
     * @return List of UserDTOs
     */
    List<UserDTO> getAllUsers();
    
    /**
     * Get user by ID
     * @param id User ID
     * @return Optional UserDTO
     */
    Optional<UserDTO> getUserById(Long id);
    
    /**
     * Get user by username
     * @param username Username
     * @return Optional UserDTO
     */
    Optional<UserDTO> getUserByUsername(String username);
    
    /**
     * Get user by email
     * @param email Email address
     * @return Optional UserDTO
     */
    Optional<UserDTO> getUserByEmail(String email);
    
    /**
     * Create a new user
     * @param userDTO User data
     * @return Created UserDTO
     */
    UserDTO createUser(UserDTO userDTO);
    
    /**
     * Update existing user
     * @param id User ID
     * @param userDTO Updated user data
     * @return Updated UserDTO
     */
    UserDTO updateUser(Long id, UserDTO userDTO);
    
    /**
     * Delete user
     * @param id User ID
     */
    void deleteUser(Long id);
    
    /**
     * Check if user exists
     * @param id User ID
     * @return true if exists, false otherwise
     */
    boolean existsById(Long id);
}

