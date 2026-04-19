package com.paysense.service;

import com.paysense.dto.DashboardDTO;
import com.paysense.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public DashboardDTO getDashboard(Long userId) {
        DashboardDTO dashboard = new DashboardDTO();

        BigDecimal todaySpend = transactionRepository.getTodaySpend(userId);
        BigDecimal monthlySpend = transactionRepository.getMonthlySpend(userId);
        BigDecimal monthlyBudget = userService.getUserById(userId).getMonthlyBudget();

        dashboard.setTodaySpend(todaySpend != null ? todaySpend : BigDecimal.ZERO);
        dashboard.setMonthlySpend(monthlySpend != null ? monthlySpend : BigDecimal.ZERO);
        dashboard.setMonthlyBudget(monthlyBudget);

        BigDecimal budgetLeft = monthlyBudget.subtract(dashboard.getMonthlySpend());
        dashboard.setBudgetLeft(budgetLeft.max(BigDecimal.ZERO));

        if (monthlyBudget.compareTo(BigDecimal.ZERO) > 0) {
            dashboard.setBudgetUtilizationPercent(
                dashboard.getMonthlySpend()
                    .multiply(BigDecimal.valueOf(100))
                    .divide(monthlyBudget, 0, RoundingMode.HALF_UP)
                    .intValue()
            );
        } else {
            dashboard.setBudgetUtilizationPercent(0);
        }

        return dashboard;
    }
}
