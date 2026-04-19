// src/screens/InsightsScreen.js
import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTransactionStore } from '../store/transactionStore';
import { Colors, Spacing, BorderRadius, FontSizes } from '../utils/colors';

export default function InsightsScreen() {
  const { transactions, fetchTransactions } = useTransactionStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const calculateCategoryBreakdown = () => {
    const breakdown = {};
    (transactions || []).forEach((t) => {
      breakdown[t.category] = (breakdown[t.category] || 0) + parseFloat(t.amount);
    });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  };

  const calculateWeeklyTrend = () => {
    const now = new Date();
    const weekData = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      weekData[dayKey] = 0;
    }

    (transactions || []).forEach((t) => {
      const date = new Date(t.timestamp);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (dayKey in weekData) {
        weekData[dayKey] += parseFloat(t.amount);
      }
    });

    return Object.entries(weekData).reverse();
  };

  const calculateMetrics = () => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSpend: 0,
        averageDaily: 0,
        largestTransaction: 0,
        smallSpends: 0,
        topCategory: 'N/A',
      };
    }

    const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const largest = Math.max(...transactions.map((t) => parseFloat(t.amount)));
    const smallCount = transactions
      .filter((t) => parseFloat(t.amount) < 50)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const categoryBreakdown = calculateCategoryBreakdown();
    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0][0] : 'N/A';

    return {
      totalSpend: total,
      averageDaily: (total / 7).toFixed(0),
      largestTransaction: largest,
      smallSpends: smallCount,
      topCategory,
    };
  };

  const metrics = calculateMetrics();
  const categoryBreakdown = calculateCategoryBreakdown();
  const weeklyTrend = calculateWeeklyTrend();

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔',
      'Travel': '🚗',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Education': '📚',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Subscription': '📱',
      'Other': '💸',
    };
    return emojis[category] || '💸';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Spending Insights</Text>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Spend</Text>
          <Text style={styles.metricValue}>₹{metrics.totalSpend.toFixed(0)}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg Daily</Text>
          <Text style={styles.metricValue}>₹{metrics.averageDaily}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Largest</Text>
          <Text style={styles.metricValue}>₹{metrics.largestTransaction}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Small Spends</Text>
          <Text style={styles.metricValue}>₹{metrics.smallSpends.toFixed(0)}</Text>
        </View>
      </View>

      {/* Top Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Category</Text>
        <View style={styles.topCategoryCard}>
          <Text style={styles.topCategoryEmoji}>{getCategoryEmoji(metrics.topCategory)}</Text>
          <Text style={styles.topCategoryName}>{metrics.topCategory}</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categoryBreakdown.length > 0 ? (
          categoryBreakdown.map((entry, index) => {
            const [category, amount] = entry;
            const total = categoryBreakdown.reduce((sum, [, val]) => sum + val, 0);
            const percentage = (amount / total) * 100;

            return (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {getCategoryEmoji(category)} {category}
                  </Text>
                  <View style={styles.progressSmall}>
                    <View
                      style={[
                        styles.progressFillSmall,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryAmount}>₹{amount.toFixed(0)}</Text>
                  <Text style={styles.categoryPercent}>{percentage.toFixed(0)}%</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>

      {/* Weekly Trend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Trend</Text>
        <View style={styles.weeklyContainer}>
          {weeklyTrend.map((entry, index) => {
            const [day, amount] = entry;
            const maxAmount = Math.max(...weeklyTrend.map((e) => e[1]), 1);
            const barHeight = (amount / maxAmount) * 100;

            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${Math.max(barHeight, 10)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day}</Text>
                <Text style={styles.barAmount}>₹{amount.toFixed(0)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Savings Opportunity */}
      <View style={[styles.section, styles.insightCard]}>
        <Text style={styles.insightTitle}>💡 Spending Insight</Text>
        <Text style={styles.insightText}>
          You spent ₹{metrics.smallSpends.toFixed(0)} on small purchases under ₹50. Reducing these by 20% could save you ₹{(metrics.smallSpends * 0.2).toFixed(0)} per week!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  topCategoryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.md,
  },
  topCategoryEmoji: {
    fontSize: 40,
  },
  topCategoryName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  categoryName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  progressSmall: {
    height: 4,
    backgroundColor: Colors.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  categoryPercent: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  weeklyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    gap: Spacing.sm,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  barLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  barAmount: {
    fontSize: FontSizes.xs,
    color: Colors.text.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  noDataText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  insightCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  insightTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: Spacing.sm,
  },
  insightText: {
    fontSize: FontSizes.sm,
    color: '#92400E',
    lineHeight: 20,
  },
});
