import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsSummary } from '../api/endpoints';
import type { AnalyticsSummary } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

export const AnalyticsSummaryScreen = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: fetchAnalyticsSummary,
  });

  const summary = (data ?? {}) as AnalyticsSummary;

  return (
    <Screen>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>High-level business metrics from Diver Now.</Text>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primarySoft} />
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            There was a problem loading analytics. Pull to refresh later.
          </Text>
        </View>
      ) : (
        <View style={styles.cardsRow}>
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Revenue</Text>
            <Text style={styles.cardValue}>
              {typeof summary.totalRevenue === 'number'
                ? `$${summary.totalRevenue.toLocaleString()}`
                : '—'}
            </Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Cleanings</Text>
            <Text style={styles.cardValue}>
              {typeof summary.totalCleanings === 'number'
                ? summary.totalCleanings.toLocaleString()
                : '—'}
            </Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Customers</Text>
            <Text style={styles.cardValue}>
              {typeof summary.totalCustomers === 'number'
                ? summary.totalCustomers.toLocaleString()
                : '—'}
            </Text>
          </Card>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...text.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.dangerSoft,
    textAlign: 'center',
    ...text.body,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardLabel: {
    ...text.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

