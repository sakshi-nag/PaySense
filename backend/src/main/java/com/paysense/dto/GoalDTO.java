package com.paysense.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalDTO {
    private Long id;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal savedAmount;
    private Integer progressPercent;
}
