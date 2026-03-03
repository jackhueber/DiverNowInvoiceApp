import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../state/AuthContext';
import { ApiError } from '../api/client';
import { Screen } from '../components/layout/Screen';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, radii, spacing, text } from '../theme/tokens';

export const LoginScreen = () => {
  const { login, loggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Invalid email or password');
        } else {
          const msg =
            err.body && typeof err.body === 'object' && 'error' in err.body
              ? String((err.body as { error: unknown }).error)
              : `Server error (${err.status}). Please try again.`;
          setError(msg);
        }
      } else {
        const msg = (err as Error)?.message ?? '';
        if (msg.includes('fetch') || msg === 'Network request failed') {
          setError('Could not reach server. Check that the API is running and try again.');
        } else {
          setError('Unable to sign in. Please try again.');
        }
      }
    }
  };

  const disabled = loggingIn || !email.trim() || !password;

  return (
    <Screen contentStyle={styles.screenContent}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Card style={styles.card}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Diver Now logo"
          />
          <Text style={styles.title}>Diver Now Admin</Text>
          <Text style={styles.subtitle}>Sign in to manage jobs</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCorrect={false}
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Sign in"
            onPress={() => {
              void handleSubmit();
            }}
            variant="primary"
            disabled={disabled}
            loading={loggingIn}
            style={styles.button}
          />
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboard: {
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surfaceMuted,
  },
  logo: {
    width: 160,
    height: 80,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...text.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...text.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...text.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.xs,
  },
});

