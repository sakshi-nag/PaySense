package com.paysense.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.math.BigDecimal;

@Service
public class TransactionCategoryService {

    /**
     * Categorizes a merchant based on predefined rules
     */
    public String categorizeTransaction(String merchant) {
        if (merchant == null) return "Other";
        
        String lowerMerchant = merchant.toLowerCase();

        if (matchesFoodCategory(lowerMerchant)) return "Food";
        if (matchesTravelCategory(lowerMerchant)) return "Travel";
        if (matchesShoppingCategory(lowerMerchant)) return "Shopping";
        if (matchesBillsCategory(lowerMerchant)) return "Bills";
        if (matchesEducationCategory(lowerMerchant)) return "Education";
        if (matchesEntertainmentCategory(lowerMerchant)) return "Entertainment";
        if (matchesHealthCategory(lowerMerchant)) return "Health";
        if (matchesSubscriptionCategory(lowerMerchant)) return "Subscription";

        return "Other";
    }

    private boolean matchesFoodCategory(String merchant) {
        String[] foodKeywords = {"zomato", "swiggy", "cafe", "restaurant", "pizza", "burger",
            "coffee", "tea", "juice", "bakery", "dosa", "biryani", "dhaba", "hotel", "food"};
        return matchesKeywords(merchant, foodKeywords);
    }

    private boolean matchesTravelCategory(String merchant) {
        String[] travelKeywords = {"uber", "ola", "metro", "taxi", "autorickshaw", "railway",
            "bus", "flight", "train", "travel", "transport"};
        return matchesKeywords(merchant, travelKeywords);
    }

    private boolean matchesShoppingCategory(String merchant) {
        String[] shoppingKeywords = {"myntra", "amazon", "flipkart", "ajio", "shop", "mall",
            "store", "retail", "market", "bazaar", "clothing", "apparel"};
        return matchesKeywords(merchant, shoppingKeywords);
    }

    private boolean matchesBillsCategory(String merchant) {
        String[] billsKeywords = {"recharge", "electricity", "water", "broadband", "internet",
            "phone", "mobile", "bill", "utility", "airtel", "jio", "vodafone", "bsnl"};
        return matchesKeywords(merchant, billsKeywords);
    }

    private boolean matchesEducationCategory(String merchant) {
        String[] educationKeywords = {"udemy", "coursera", "unacademy", "byjus", "vedantu",
            "exam", "course", "college", "university", "education", "tuition", "school"};
        return matchesKeywords(merchant, educationKeywords);
    }

    private boolean matchesEntertainmentCategory(String merchant) {
        String[] entertainmentKeywords = {"netflix", "youtube", "amazon prime", "disney",
            "hotstar", "movie", "cinema", "theatre", "gaming", "game", "spotify", "music"};
        return matchesKeywords(merchant, entertainmentKeywords);
    }

    private boolean matchesHealthCategory(String merchant) {
        String[] healthKeywords = {"pharmacy", "doctor", "hospital", "clinic", "health",
            "medical", "medicine", "healthcare", "fitness", "gym"};
        return matchesKeywords(merchant, healthKeywords);
    }

    private boolean matchesSubscriptionCategory(String merchant) {
        String[] subscriptionKeywords = {"subscription", "premium", "membership", "annual",
            "monthly", "paid"};
        return matchesKeywords(merchant, subscriptionKeywords);
    }

    private boolean matchesKeywords(String merchant, String[] keywords) {
        for (String keyword : keywords) {
            if (merchant.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Parses amount from SMS text
     */
    public BigDecimal parseAmount(String smsText) {
        // Patterns: "Rs 500", "₹500", "INR 500", "500 rupees"
        Pattern[] patterns = {
            Pattern.compile("(?:Rs\\.?|₹|INR)\\s*(\\d+(?:\\.\\d{2})?)"),
            Pattern.compile("(\\d+(?:\\.\\d{2})?)\\s*(?:rupees|rs\\.?)"),
            Pattern.compile("amount\\s*(?:of|:)?\\s*(\\d+(?:\\.\\d{2})?)", Pattern.CASE_INSENSITIVE)
        };

        for (Pattern pattern : patterns) {
            Matcher matcher = pattern.matcher(smsText);
            if (matcher.find()) {
                try {
                    return new BigDecimal(matcher.group(1));
                } catch (Exception e) {
                    // Continue to next pattern
                }
            }
        }
        return BigDecimal.ZERO;
    }

    /**
     * Extracts merchant name from SMS
     */
    public String extractMerchant(String smsText) {
        // Common patterns: "paid to MERCHANT", "debited to MERCHANT", "at MERCHANT"
        Pattern[] patterns = {
            Pattern.compile("(?:paid|transferred)\\s+(?:to)?\\s+([A-Za-z0-9\\s]+?)(?:\\s+(?:using|via|at)|$)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(?:debited|credited)\\s+(?:to)?\\s+([A-Za-z0-9\\s]+?)(?:\\s+(?:using|via|at|on)|$)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("at\\s+([A-Za-z0-9\\s]+?)(?:\\s+(?:using|via)|$)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("([A-Z][A-Za-z0-9]+)(?:\\s+payment|\\s+transaction)?")
        };

        for (Pattern pattern : patterns) {
            Matcher matcher = pattern.matcher(smsText);
            if (matcher.find()) {
                String merchant = matcher.group(1).trim();
                if (!merchant.isEmpty() && merchant.length() > 2) {
                    return merchant;
                }
            }
        }
        return "Unknown";
    }
}
