// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTransactionStore } from '../store/transactionStore';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, BorderRadius, FontSizes } from '../utils/colors';
import { format } from 'date-fns';

export default function DashboardScreen() {
  const [showSimulation, setShowSimulation] = useState(false);
  const { dashboard, transactions, fetchDashboard, fetchTransactions, createTransaction } = useTransactionStore();
  const { user } = useAuthStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboard();
      fetchTransactions();
    }, [])
  );

  const simulatedTransactions = [
    { amount: 149, merchant: 'Zomato', category: 'Food', upiApp: 'Google Pay' },
    { amount: 220, merchant: 'Uber', category: 'Travel', upiApp: 'Google Pay' },
    { amount: 20, merchant: 'Tea Stall', category: 'Food', upiApp: 'PhonePe' },
    { amount: 899, merchant: 'Amazon', category: 'Shopping', upiApp: 'Google Pay' },
    { amount: 500, merchant: 'Electricity Bill', category: 'Bills', upiApp: 'Paytm' },
  ];

  const handleSimulateTransaction = async () => {
    const transaction = simulatedTransactions[
      Math.floor(Math.random() * simulatedTransactions.length)
    ];

    const result = await createTransaction({
      amount: transaction.amount,
      merchant: transaction.merchant,
      category: transaction.category,
      upiApp: transaction.upiApp,
      timestamp: new Date(),
      confirmed: true,
    });

    if (result.success) {
      Alert.alert('Success', `₹${transaction.amount} transaction added for ${transaction.merchant}`);
      setShowSimulation(false);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryIconText}>{getCategoryEmoji(item.category)}</Text>
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionMerchant}>{item.merchant}</Text>
          <Text style={styles.transactionTime}>
            {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
          </Text>
        </View>
      </View>
      <Text style={styles.transactionAmount}>-₹{item.amount}</Text>
    </View>
  );

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

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#FEE2E2',
      'Travel': '#DBEAFE',
      'Shopping': '#FCE7F3',
      'Bills': '#FEF3C7',
      'Education': '#E0E7FF',
      'Entertainment': '#F3E8FF',
      'Health': '#DCFCE7',
      'Subscription': '#F5F3FF',
      'Other': '#F3F4F6',
    };
    return colors[category] || '#F3F4F6';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Hello, {user?.name?.split(' ')[0]}</Text>
        <Text style={styles.greetingSubtext}>How are your finances today?</Text>
      </View>

      {/* Spend Cards */}
      <View style={styles.cards}>
        <View style={[styles.card, styles.cardPrimary]}>
          <Text style={styles.cardLabel}>Today Spend</Text>
          <Text style={styles.cardAmount}>₹{dashboard?.todaySpend || 0}</Text>
        </View>
        <View style={[styles.card, styles.cardSecondary]}>
          <Text style={styles.cardLabel}>Monthly Spend</Text>
          <Text style={styles.cardAmount}>₹{dashboard?.monthlySpend || 0}</Text>
        </View>
      </View>

      {/* Budget Progress */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetTitle}>Monthly Budget</Text>
          <Text style={styles.budgetPercent}>{dashboard?.budgetUtilizationPercent || 0}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(dashboard?.budgetUtilizationPercent || 0, 100)}%`,
                backgroundColor:
                  (dashboard?.budgetUtilizationPercent || 0) > 80 ? Colors.danger : Colors.primary,
              },
            ]}
          />
        </View>
        <View style={styles.budgetFooter}>
          <Text style={styles.budgetSpend}>₹{dashboard?.monthlySpend || 0} / ₹{dashboard?.monthlyBudget || 0}</Text>
          <Text style={styles.budgetLeft}>₹{dashboard?.budgetLeft || 0} left</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransactionItem}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}
      </View>

      {/* Demo Mode Button */}
      <TouchableOpacity
        style={styles.simulateButton}
        onPress={handleSimulateTransaction}
      >
        <Text style={styles.simulateButtonText}>+ Simulate Transaction</Text>
      </TouchableOpacity>
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
  greeting: {
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  greetingSubtext: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  cards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },
  cardPrimary: {
    backgroundColor: Colors.primary,
  },
  cardSecondary: {
    backgroundColor: '#1F2937',
  },
  cardLabel: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.xs,
  },
  cardAmount: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.white,
  },
  budgetCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  budgetTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  budgetPercent: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpend: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  budgetLeft: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary,
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
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  transactionTime: {
    fontSize: FontSizes.sm,
    color: Colors.text.light,
    marginTop: Spacing.xs,
  },
  transactionAmount: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  emptyState: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
  },
  simulateButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  simulateButtonText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
});
