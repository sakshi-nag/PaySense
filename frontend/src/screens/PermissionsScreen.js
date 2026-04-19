// src/screens/PermissionsScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, BorderRadius, FontSizes } from '../utils/colors';

export default function PermissionsScreen({ navigation }) {
  const [smsPermission, setSmsPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const { completeOnboarding } = useAuthStore();

  const handleSmsPermission = () => {
    setSmsPermission(!smsPermission);
  };

  const handleNotificationPermission = () => {
    setNotificationPermission(!notificationPermission);
  };

  const handleContinue = async () => {
    if (!smsPermission) {
      Alert.alert('SMS Permission Required', 'SMS permission is required to auto-detect transactions');
      return;
    }

    await completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Permissions</Text>
        <Text style={styles.subtitle}>Enable permissions for a better experience</Text>
      </View>

      <View style={styles.permissionsList}>
        <View style={[styles.permissionCard, smsPermission && styles.permissionCardActive]}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>📨 SMS Access</Text>
            <Text style={styles.permissionDescription}>
              We need access to payment SMS messages to auto-detect your transactions.
            </Text>
            <Text style={styles.permissionNote}>
              ✓ Only payment messages are analyzed
            </Text>
            <Text style={styles.permissionNote}>
              ✓ Personal chats remain private
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.permissionButton, smsPermission && styles.permissionButtonActive]}
            onPress={handleSmsPermission}
          >
            <Text style={styles.permissionButtonText}>
              {smsPermission ? '✓' : 'Enable'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.permissionCard, notificationPermission && styles.permissionCardActive]}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionTitle}>🔔 Notifications</Text>
            <Text style={styles.permissionDescription}>
              Get alerts for large transactions and spending reminders.
            </Text>
            <Text style={styles.permissionNote}>
              ✓ Smart nudges to help you save
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.permissionButton, notificationPermission && styles.permissionButtonActive]}
            onPress={handleNotificationPermission}
          >
            <Text style={styles.permissionButtonText}>
              {notificationPermission ? '✓' : 'Enable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyTitle}>Your Privacy is Important</Text>
        <Text style={styles.privacyText}>
          PaySense is designed with privacy first. We only access payment-related messages and never share your data with third parties.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
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
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.text.secondary,
  },
  permissionsList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  permissionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  permissionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDF4',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  permissionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  permissionNote: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  permissionButton: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  permissionButtonActive: {
    backgroundColor: Colors.primary,
  },
  permissionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  privacyNote: {
    backgroundColor: '#F0FDF4',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  privacyTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  privacyText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
