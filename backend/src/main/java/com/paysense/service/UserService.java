package com.paysense.service;

import com.paysense.dto.*;
import com.paysense.entity.User;
import com.paysense.repository.UserRepository;
import com.paysense.repository.SettingsRepository;
import com.paysense.entity.Settings;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMonthlyBudget(BigDecimal.valueOf(5000)); // Default budget
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create default settings
        Settings settings = new Settings();
        settings.setUserId(savedUser.getId());
        settings.setThreshold(BigDecimal.valueOf(100));
        settings.setAutoCategory(true);
        settings.setNotifications(true);
        settings.setDarkMode(false);
        settingsRepository.save(settings);

        return savedUser;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateBudget(Long userId, BigDecimal newBudget) {
        User user = getUserById(userId);
        user.setMonthlyBudget(newBudget);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getMonthlyBudget());
    }
}
