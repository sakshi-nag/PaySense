package com.paysense.service;

import com.paysense.dto.GoalDTO;
import com.paysense.entity.Goal;
import com.paysense.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    @Transactional
    public Goal createGoal(Long userId, String title, BigDecimal targetAmount, LocalDateTime deadline) {
        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setTitle(title);
        goal.setTargetAmount(targetAmount);
        goal.setSavedAmount(BigDecimal.ZERO);
        goal.setDeadline(deadline);
        goal.setCreatedAt(LocalDateTime.now());
        goal.setUpdatedAt(LocalDateTime.now());

        return goalRepository.save(goal);
    }

    @Transactional
    public Goal addSavings(Long goalId, BigDecimal amount) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        goal.setSavedAmount(goal.getSavedAmount().add(amount));
        goal.setUpdatedAt(LocalDateTime.now());

        return goalRepository.save(goal);
    }

    public Goal getGoal(Long goalId) {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public List<GoalDTO> getUserGoals(Long userId) {
        return goalRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        goalRepository.deleteById(goalId);
    }

    public GoalDTO toDTO(Goal goal) {
        int progressPercent = goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0 ?
            goal.getSavedAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(goal.getTargetAmount(), 0, RoundingMode.HALF_UP)
                .intValue() : 0;

        return new GoalDTO(goal.getId(), goal.getTitle(), goal.getTargetAmount(), 
                           goal.getSavedAmount(), progressPercent);
    }
}
