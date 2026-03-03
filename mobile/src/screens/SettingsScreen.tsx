import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../state/AuthContext';
import { registerPush } from '../api/endpoints';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { colors, spacing, text } from '../theme/tokens';

export const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [pushRegistered, setPushRegistered] = useState(false);

  const registerPushMutation = useMutation({
    mutationFn: registerPush,
    onSuccess: () => {
      setPushRegistered(true);
    },
  });

  const handleRegisterPush = async () => {
    if (!user?.email) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();

    await registerPushMutation.mutateAsync({
      deviceToken: typeof token === 'string' ? token : token.data,
      email: user.email,
      platform: 'ios',
    });
  };

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      {user ? (
        <View style={styles.section}>
          <Text style={styles.label}>Signed in as</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      ) : null}

      {user ? (
        <View style={styles.section}>
          <Text style={styles.label}>Push notifications</Text>
          <Button
            title={pushRegistered ? 'Device registered' : 'Register this device'}
            onPress={() => {
              void handleRegisterPush();
            }}
            variant="primary"
            loading={registerPushMutation.isPending}
            disabled={registerPushMutation.isPending}
            style={styles.primaryButton}
          />
        </View>
      ) : null}

      <Button
        title="Sign out"
        onPress={() => {
          void logout();
        }}
        variant="danger"
        style={styles.logoutButton}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.title,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...text.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  primaryButton: {
    marginTop: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
});

