import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchOrders, syncSquarespace } from '../api/endpoints';
import type { Order } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

export const OrdersScreen = () => {
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const syncMutation = useMutation({
    mutationFn: syncSquarespace,
    onSuccess: () => {
      void refetch();
    },
  });

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderItem = ({ item }: { item: Order }) => {
    const createdAt = item.createdAt ? new Date(item.createdAt) : null;

    return (
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>
          {item.orderNumber ? `Order #${item.orderNumber}` : String(item.id)}
        </Text>
        {item.customerName ? <Text style={styles.cardSubTitle}>{item.customerName}</Text> : null}
        {createdAt ? (
          <Text style={styles.metaText}>{createdAt.toLocaleString()}</Text>
        ) : null}
        <View style={styles.metaRow}>
          {item.status ? <Text style={styles.metaText}>Status: {item.status}</Text> : null}
          {typeof item.total === 'number' ? (
            <Text style={styles.metaText}>${item.total.toFixed(2)}</Text>
          ) : null}
        </View>
      </Card>
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>Squarespace orders synced to Diver Now.</Text>
        </View>
        <Button
          title={syncMutation.isPending ? 'Syncing…' : 'Sync'}
          onPress={() => {
            void syncMutation.mutateAsync();
          }}
          variant="primary"
          loading={syncMutation.isPending}
          disabled={syncMutation.isPending}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primarySoft} />
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            There was a problem loading orders. Pull to refresh to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders ?? []}
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
            !orders || orders.length === 0 ? styles.emptyListContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders found yet.</Text>
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...text.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...text.subtitle,
    color: colors.textSecondary,
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

