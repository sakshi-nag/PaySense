package com.paysense.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal todaySpend;
    private BigDecimal monthlySpend;
    private BigDecimal monthlyBudget;
    private BigDecimal budgetLeft;
    private Integer budgetUtilizationPercent;
    private Integer transactionCount;
}
