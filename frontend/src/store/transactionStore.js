// src/store/transactionStore.js
import create from 'zustand';
import { transactionAPI, dashboardAPI, goalAPI } from '../utils/api';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  dashboard: null,
  goals: [],
  loading: false,
  error: null,

  // Fetch dashboard data
  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const response = await dashboardAPI.get();
      set({ dashboard: response.data, error: null });
    } catch (error) {
      // Fallback to local data
      const state = get();
      const totalSpend = state.transactions.reduce((sum, t) => sum + t.amount, 0);
      set({ 
        dashboard: {
          todaySpend: state.transactions
            .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
            .reduce((sum, t) => sum + t.amount, 0),
          monthlySpend: totalSpend,
          monthlyBudget: 50000,
          budgetLeft: 50000 - totalSpend,
          budgetUtilizationPercent: (totalSpend / 50000) * 100,
          transactionCount: state.transactions.length,
        },
        error: null 
      });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all transactions
  fetchTransactions: async () => {
    set({ loading: true });
    try {
      const response = await transactionAPI.getAll();
      set({ transactions: response.data, error: null });
    } catch (error) {
      // Keep local transactions if backend fails
      set({ error: null });
    } finally {
      set({ loading: false });
    }
  },

  // Create transaction
  createTransaction: async (transaction) => {
    try {
      // Try to create on backend
      const response = await transactionAPI.create(transaction);
      set((state) => ({
        transactions: [response.data, ...state.transactions],
      }));
    } catch (error) {
      // Fallback: store locally with temporary ID
      const newTransaction = {
        ...transaction,
        id: Date.now(),
        timestamp: transaction.timestamp || new Date().toISOString(),
      };
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
    }
    // Refresh dashboard
    get().fetchDashboard();
    return { success: true };
  },

  // Update transaction
  updateTransaction: async (id, transaction) => {
    try {
      const response = await transactionAPI.update(id, transaction);
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? response.data : t)),
      }));
      get().fetchDashboard();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      await transactionAPI.delete(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      get().fetchDashboard();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch goals
  fetchGoals: async () => {
    try {
      const response = await goalAPI.getAll();
      set({ goals: response.data, error: null });
    } catch (error) {
      set({ error: null }); // Keep local goals
    }
  },

  // Create goal
  createGoal: async (goal) => {
    try {
      const response = await goalAPI.create(goal);
      set((state) => ({
        goals: [...state.goals, response.data],
      }));
      return { success: true };
    } catch (error) {
      // Fallback: store locally
      const newGoal = {
        ...goal,
        id: Date.now(),
        savedAmount: 0,
      };
      set((state) => ({
        goals: [...state.goals, newGoal],
      }));
      return { success: true };
    }
  },

  // Add savings to goal
  addSavings: async (goalId, amount) => {
    try {
      const response = await goalAPI.addSavings(goalId, amount);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? response.data : g)),
      }));
      return { success: true };
    } catch (error) {
      // Fallback: update locally
      set((state) => ({
        goals: state.goals.map((g) => 
          g.id === goalId 
            ? { ...g, savedAmount: (g.savedAmount || 0) + amount }
            : g
        ),
      }));
      return { success: true };
    }
  },

  // Delete goal
  deleteGoal: async (id) => {
    try {
      await goalAPI.delete(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
      return { success: true };
    } catch (error) {
      // Fallback: delete locally
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
      return { success: true };
    }
  },
      return { success: false, error: error.message };
    }
  },
}));
