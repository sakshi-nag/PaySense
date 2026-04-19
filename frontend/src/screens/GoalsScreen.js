// src/screens/GoalsScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTransactionStore } from '../store/transactionStore';
import { Colors, Spacing, BorderRadius, FontSizes } from '../utils/colors';

export default function GoalsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingAmount, setSavingAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(false);

  const { goals, fetchGoals, createGoal, addSavings, deleteGoal } = useTransactionStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchGoals();
    }, [])
  );

  const handleCreateGoal = async () => {
    if (!goalTitle || !targetAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await createGoal({
      title: goalTitle,
      targetAmount: parseFloat(targetAmount),
      deadline: null,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Goal created successfully');
      setGoalTitle('');
      setTargetAmount('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleAddSavings = async () => {
    if (!savingAmount || !selectedGoal) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    setLoading(true);
    const result = await addSavings(selectedGoal.id, parseFloat(savingAmount));
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Savings added!');
      setSavingAmount('');
      setSelectedGoal(null);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteGoal = (goalId) => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          const result = await deleteGoal(goalId);
          if (!result.success) {
            Alert.alert('Error', result.error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderGoalItem = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteGoal(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${item.progressPercent || 0}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          ₹{item.savedAmount.toFixed(0)} of ₹{item.targetAmount.toFixed(0)}
        </Text>
        <Text style={styles.progressPercent}>{item.progressPercent || 0}% Complete</Text>
      </View>

      <TouchableOpacity
        style={styles.addSavingsButton}
        onPress={() => setSelectedGoal(item)}
      >
        <Text style={styles.addSavingsButtonText}>+ Add Savings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Savings Goals</Text>
          <Text style={styles.headerSubtitle}>Track your financial goals</Text>
        </View>

        {goals && goals.length > 0 ? (
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGoalItem}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptyText}>Create your first savings goal to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Create Goal Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Goal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Goal Title (e.g., Goa Trip)"
              placeholderTextColor={Colors.text.light}
              value={goalTitle}
              onChangeText={setGoalTitle}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Target Amount (₹)"
              placeholderTextColor={Colors.text.light}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCreateGoal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Create Goal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Savings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedGoal !== null}
        onRequestClose={() => setSelectedGoal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Savings to {selectedGoal?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedGoal(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount to Save (₹)"
              placeholderTextColor={Colors.text.light}
              value={savingAmount}
              onChangeText={setSavingAmount}
              keyboardType="decimal-pad"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAddSavings}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Add Savings</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  goalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
  },
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  progressPercent: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  addSavingsButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addSavingsButtonText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalClose: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base,
    marginBottom: Spacing.md,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
