package com.paysense.service;

import com.paysense.dto.TransactionDTO;
import com.paysense.entity.Transaction;
import com.paysense.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionCategoryService categoryService;

    @Transactional
    public Transaction createTransaction(Long userId, TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setAmount(dto.getAmount());
        transaction.setMerchant(dto.getMerchant());
        transaction.setUpiApp(dto.getUpiApp());
        transaction.setCategory(dto.getCategory() != null ? 
            dto.getCategory() : categoryService.categorizeTransaction(dto.getMerchant()));
        transaction.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now());
        transaction.setSourceSms(dto.getSourceSms());
        transaction.setConfirmed(dto.getConfirmed() != null ? dto.getConfirmed() : false);
        
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long transactionId, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (dto.getAmount() != null) transaction.setAmount(dto.getAmount());
        if (dto.getMerchant() != null) transaction.setMerchant(dto.getMerchant());
        if (dto.getCategory() != null) transaction.setCategory(dto.getCategory());
        if (dto.getConfirmed() != null) transaction.setConfirmed(dto.getConfirmed());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        return transactionRepository.save(transaction);
    }

    public Transaction getTransaction(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<TransactionDTO> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getUserTransactionsByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByUserIdAndTimestampBetween(userId, start, end)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTransaction(Long transactionId) {
        transactionRepository.deleteById(transactionId);
    }

    public TransactionDTO toDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getMerchant(),
                transaction.getUpiApp(),
                transaction.getCategory(),
                transaction.getTimestamp(),
                transaction.getSourceSms(),
                transaction.getConfirmed()
        );
    }
}
