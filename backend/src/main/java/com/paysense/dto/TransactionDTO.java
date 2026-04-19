package com.paysense.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private String merchant;
    private String upiApp;
    private String category;
    private LocalDateTime timestamp;
    private String sourceSms;
    private Boolean confirmed;
}
