package com.paysense.controller;

import com.paysense.dto.GoalDTO;
import com.paysense.entity.Goal;
import com.paysense.service.GoalService;
import com.paysense.security.JwtTokenProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final JwtTokenProvider jwtTokenProvider;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class CreateGoalRequest {
        private String title;
        private BigDecimal targetAmount;
        private LocalDateTime deadline;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class AddSavingsRequest {
        private BigDecimal amount;
    }

    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(
            @RequestBody CreateGoalRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        Goal goal = goalService.createGoal(userId, request.getTitle(), request.getTargetAmount(), request.getDeadline());
        return ResponseEntity.ok(goalService.toDTO(goal));
    }

    @PostMapping("/{id}/savings")
    public ResponseEntity<GoalDTO> addSavings(
            @PathVariable Long id,
            @RequestBody AddSavingsRequest request) {
        Goal goal = goalService.addSavings(id, request.getAmount());
        return ResponseEntity.ok(goalService.toDTO(goal));
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> getUserGoals(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return ResponseEntity.ok(goalService.getUserGoals(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoal(@PathVariable Long id) {
        Goal goal = goalService.getGoal(id);
        return ResponseEntity.ok(goalService.toDTO(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
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
