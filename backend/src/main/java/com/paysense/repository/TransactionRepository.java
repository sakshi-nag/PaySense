package com.paysense.repository;

import com.paysense.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<Transaction> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    List<Transaction> findByUserIdAndCategory(Long userId, String category);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = ?1 AND DATE(t.timestamp) = CURRENT_DATE")
    BigDecimal getTodaySpend(Long userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = ?1 AND YEAR(t.timestamp) = YEAR(CURRENT_DATE) AND MONTH(t.timestamp) = MONTH(CURRENT_DATE)")
    BigDecimal getMonthlySpend(Long userId);
}
