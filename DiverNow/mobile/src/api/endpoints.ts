import { apiClient } from './client';
import type {
  AnalyticsSummary,
  CalendarEvent,
  Cleaning,
  CustomerAnalytics,
  Mapping,
  Order,
  User,
} from '../types/domain';

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (payload: LoginRequest): Promise<void> => {
  await apiClient.post('/api/auth/login', payload);
};

export const fetchMe = async (): Promise<User> => {
  return apiClient.get<User>('/api/me');
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

export const fetchCalendarEvents = async (): Promise<CalendarEvent[]> => {
  return apiClient.get<CalendarEvent[]>('/api/calendar/events');
};

export const syncCalendar = async (): Promise<void> => {
  await apiClient.post<void>('/api/calendar/sync');
};

export const fetchCleanings = async (): Promise<Cleaning[]> => {
  return apiClient.get<Cleaning[]>('/api/cleanings');
};

export const fetchMappings = async (): Promise<Mapping[]> => {
  return apiClient.get<Mapping[]>('/api/mappings');
};

export const deleteMapping = async (id: number | string): Promise<void> => {
  await apiClient.delete<void>(`/api/mappings/${id}`);
};

export const fetchOrders = async (): Promise<Order[]> => {
  return apiClient.get<Order[]>('/api/squarespace/orders');
};

export const syncSquarespace = async (): Promise<void> => {
  await apiClient.post<void>('/api/squarespace/sync');
};

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  return apiClient.get<AnalyticsSummary>('/api/analytics/summary');
};

export const fetchCustomerAnalytics = async (): Promise<CustomerAnalytics[]> => {
  return apiClient.get<CustomerAnalytics[]>('/api/analytics/customers');
};

export interface PushRegistrationPayload {
  deviceToken: string;
  email: string;
  platform: string;
}

export const registerPush = async (payload: PushRegistrationPayload): Promise<void> => {
  await apiClient.post<void>('/api/push/register', payload);
};

