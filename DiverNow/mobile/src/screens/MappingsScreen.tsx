import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteMapping, fetchMappings } from '../api/endpoints';
import type { Mapping } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

export const MappingsScreen = () => {
  const {
    data: mappings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['mappings'],
    queryFn: fetchMappings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMapping,
    onSuccess: () => {
      void refetch();
    },
  });

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleDelete = (mapping: Mapping) => {
    Alert.alert(
      'Remove mapping',
      'Are you sure you want to remove this mapping?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            void deleteMutation.mutateAsync(mapping.id);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderItem = ({ item }: { item: Mapping }) => (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{item.customerName ?? 'Unlabeled mapping'}</Text>
      {item.boatName ? <Text style={styles.cardSubTitle}>{item.boatName}</Text> : null}
      <Text style={styles.metaText}>Event: {item.eventId}</Text>
      {item.invoiceId ? <Text style={styles.metaText}>Invoice: {item.invoiceId}</Text> : null}

      <View style={styles.actionsRow}>
        <Button
          title={deleteMutation.isPending ? 'Removing…' : 'Remove'}
          onPress={() => handleDelete(item)}
          variant="danger"
          disabled={deleteMutation.isPending}
          loading={deleteMutation.isPending}
        />
      </View>
    </Card>
  );

  return (
    <Screen>
      <Text style={styles.title}>Mappings</Text>
      <Text style={styles.subtitle}>
        Link Google Calendar events to invoices created in Diver Now.
      </Text>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primarySoft} />
        </View>
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            There was a problem loading mappings. Pull to refresh to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mappings ?? []}
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
            !mappings || mappings.length === 0 ? styles.emptyListContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No mappings found yet.</Text>
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
  metaText: {
    ...text.label,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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

