import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchCleanings } from '../api/endpoints';
import type { Cleaning } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

export const CleaningsScreen = () => {
  const {
    data: cleanings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['cleanings'],
    queryFn: fetchCleanings,
  });

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderItem = ({ item }: { item: Cleaning }) => {
    const date = item.date ? new Date(item.date) : null;

    return (
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{item.customerName}</Text>
        {item.boatName ? <Text style={styles.cardSubTitle}>{item.boatName}</Text> : null}
        {date ? <Text style={styles.metaText}>{date.toLocaleDateString()}</Text> : null}
        <View style={styles.metaRow}>
          {item.status ? <Text style={styles.metaText}>Status: {item.status}</Text> : null}
          {typeof item.price === 'number' ? (
            <Text style={styles.metaText}>${item.price.toFixed(2)}</Text>
          ) : null}
        </View>
        {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
      </Card>
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>Cleanings</Text>
      <Text style={styles.subtitle}>Recent cleaning records from Diver Now.</Text>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primarySoft} />
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            There was a problem loading cleanings. Pull to refresh to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={cleanings ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              tintColor={colors.primarySoft}
              colors={[colors.primarySoft]}
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
          contentContainerStyle={
            !cleanings || cleanings.length === 0 ? styles.emptyListContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No cleanings found yet.</Text>
          }
        />
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
    marginBottom: spacing.md,
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
  card: {
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardSubTitle: {
    ...text.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    ...text.label,
    color: colors.textSecondary,
  },
  notesText: {
    ...text.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyListContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    ...text.body,
    textAlign: 'center',
  },
});

