import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCalendarEvents, syncCalendar } from '../api/endpoints';
import type { CalendarEvent } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

export const CalendarScreen = () => {
  const {
    data: events,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: fetchCalendarEvents,
  });

  const syncMutation = useMutation({
    mutationFn: syncCalendar,
    onSuccess: () => {
      void refetch();
    },
  });

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const renderItem = ({ item }: { item: CalendarEvent }) => {
    const start = item.start ? new Date(item.start) : null;

    return (
      <Card style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.summary}</Text>
        {start ? <Text style={styles.eventDate}>{start.toLocaleString()}</Text> : null}
        {item.location ? <Text style={styles.eventMeta}>{item.location}</Text> : null}
        {item.status ? <Text style={styles.eventMeta}>Status: {item.status}</Text> : null}
      </Card>
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Upcoming jobs from Google Calendar.</Text>
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
            There was a problem loading your calendar. Pull to refresh to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events ?? []}
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
            !events || events.length === 0 ? styles.emptyListContainer : undefined
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No upcoming jobs found. Tap Sync to pull in events from Google Calendar.
            </Text>
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
  eventCard: {
    marginBottom: spacing.sm,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  eventDate: {
    ...text.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  eventMeta: {
    ...text.label,
    color: colors.textMuted,
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

