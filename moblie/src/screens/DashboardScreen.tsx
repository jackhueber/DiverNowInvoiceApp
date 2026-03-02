import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCalendarEvents, fetchCleanings, syncCalendar } from '../api/endpoints';
import type { CalendarEvent, Cleaning } from '../types/domain';
import { Screen } from '../components/layout/Screen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing, text } from '../theme/tokens';

function formatDateRange(from: Date, to: Date): { from: string; to: string } {
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

type DashboardItem = {
  type: 'event';
  event: CalendarEvent;
  cleaning?: Cleaning;
};

export const DashboardScreen = () => {
  const range = useMemo(() => {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 14);
    return formatDateRange(from, to);
  }, []);

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
    isRefetching: eventsRefetching,
  } = useQuery({
    queryKey: ['calendar-events', range.from, range.to],
    queryFn: () => fetchCalendarEvents(range),
  });

  const {
    data: cleanings,
    isLoading: cleaningsLoading,
    isError: cleaningsError,
    refetch: refetchCleanings,
    isRefetching: cleaningsRefetching,
  } = useQuery({
    queryKey: ['cleanings'],
    queryFn: fetchCleanings,
  });

  const syncMutation = useMutation({
    mutationFn: syncCalendar,
    onSuccess: () => {
      void refetchEvents();
    },
  });

  const items: DashboardItem[] = useMemo(() => {
    if (!events?.length) return [];
    const cleaningByEventId = new Map<string, Cleaning>();
    (cleanings ?? []).forEach((c) => {
      const eid = c.calendar_event_id != null ? String(c.calendar_event_id) : null;
      if (eid) cleaningByEventId.set(eid, c);
    });
    return events.map((event) => ({
      type: 'event' as const,
      event,
      cleaning: cleaningByEventId.get(String(event.id)),
    }));
  }, [events, cleanings]);

  const isLoading = eventsLoading || cleaningsLoading;
  const isError = eventsError || cleaningsError;
  const isRefetching = eventsRefetching || cleaningsRefetching;

  const handleRefresh = useCallback(() => {
    void refetchEvents();
    void refetchCleanings();
  }, [refetchEvents, refetchCleanings]);

  const renderItem = ({ item }: { item: DashboardItem }) => {
    const { event, cleaning } = item;
    const start = event.start ? new Date(event.start) : null;
    const status = cleaning?.status ?? 'pending';
    const statusLabel =
      status === 'yes' ? 'Completed' : status === 'no' ? 'Skipped' : 'Pending';

    return (
      <Card style={styles.card}>
        <Text style={styles.eventTitle}>{event.summary ?? 'Untitled event'}</Text>
        {start ? (
          <Text style={styles.eventDate}>{start.toLocaleString()}</Text>
        ) : null}
        {event.location ? (
          <Text style={styles.eventMeta}>{event.location}</Text>
        ) : null}
        <View style={styles.statusRow}>
          <Text style={[styles.statusBadge, styles[`status_${status}` as keyof typeof styles]]}>
            {statusLabel}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Jobs and cleaning status from your calendar.
          </Text>
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
            There was a problem loading data. Pull to refresh to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.event.id)}
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
            items.length === 0 ? styles.emptyListContainer : styles.listContent
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No upcoming jobs in the next 14 days. Tap Sync to pull events from
              Google Calendar.
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
  listContent: {
    paddingBottom: spacing.lg,
  },
  card: {
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
    marginTop: 2,
  },
  statusRow: {
    marginTop: spacing.sm,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  status_pending: {
    backgroundColor: colors.surfaceMuted,
    color: colors.textSecondary,
  },
  status_yes: {
    backgroundColor: '#1a472a',
    color: colors.textPrimary,
  },
  status_no: {
    backgroundColor: colors.textMuted,
    color: colors.textPrimary,
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
