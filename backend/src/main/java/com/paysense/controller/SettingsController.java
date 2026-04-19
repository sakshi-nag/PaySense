package com.paysense.controller;

import com.paysense.entity.Settings;
import com.paysense.service.SettingsService;
import com.paysense.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final JwtTokenProvider jwtTokenProvider;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class UpdateThresholdRequest {
        private BigDecimal threshold;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class UpdateBooleanSettingRequest {
        private Boolean value;
    }

    @GetMapping
    public ResponseEntity<Settings> getSettings(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(settingsService.getSettings(userId));
    }

    @PutMapping("/threshold")
    public ResponseEntity<Settings> updateThreshold(
            @RequestBody UpdateThresholdRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        return ResponseEntity.ok(settingsService.updateThreshold(userId, request.getThreshold()));
    }

    @PutMapping("/auto-category")
    public ResponseEntity<Settings> updateAutoCategory(
            @RequestBody UpdateBooleanSettingRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        return ResponseEntity.ok(settingsService.updateAutoCategory(userId, request.getValue()));
    }

    @PutMapping("/notifications")
    public ResponseEntity<Settings> updateNotifications(
            @RequestBody UpdateBooleanSettingRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        return ResponseEntity.ok(settingsService.updateNotifications(userId, request.getValue()));
    }

    @PutMapping("/dark-mode")
    public ResponseEntity<Settings> updateDarkMode(
            @RequestBody UpdateBooleanSettingRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        return ResponseEntity.ok(settingsService.updateDarkMode(userId, request.getValue()));
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        return jwtTokenProvider.getUserIdFromToken(token);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
