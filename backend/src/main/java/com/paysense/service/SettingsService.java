package com.paysense.service;

import com.paysense.entity.Settings;
import com.paysense.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public Settings getSettings(Long userId) {
        return settingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
    }

    @Transactional
    public Settings updateThreshold(Long userId, BigDecimal threshold) {
        Settings settings = getSettings(userId);
        settings.setThreshold(threshold);
        settings.setUpdatedAt(LocalDateTime.now());
        return settingsRepository.save(settings);
    }

    @Transactional
    public Settings updateAutoCategory(Long userId, Boolean autoCategory) {
        Settings settings = getSettings(userId);
        settings.setAutoCategory(autoCategory);
        settings.setUpdatedAt(LocalDateTime.now());
        return settingsRepository.save(settings);
    }

    @Transactional
    public Settings updateNotifications(Long userId, Boolean notifications) {
        Settings settings = getSettings(userId);
        settings.setNotifications(notifications);
        settings.setUpdatedAt(LocalDateTime.now());
        return settingsRepository.save(settings);
    }

    @Transactional
    public Settings updateDarkMode(Long userId, Boolean darkMode) {
        Settings settings = getSettings(userId);
        settings.setDarkMode(darkMode);
        settings.setUpdatedAt(LocalDateTime.now());
        return settingsRepository.save(settings);
    }
}
