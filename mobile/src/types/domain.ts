export interface User {
  id: number | string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

export interface CalendarEvent {
  id: number | string;
  summary: string;
  description?: string;
  start: string;
  end?: string;
  location?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Cleaning {
  id: number | string;
  calendar_event_id?: number | string;
  customerName?: string;
  boatName?: string;
  date?: string;
  price?: number;
  status?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface Mapping {
  id: number | string;
  eventId: string;
  invoiceId?: string;
  customerName?: string;
  boatName?: string;
  [key: string]: unknown;
}

export interface Order {
  id: number | string;
  orderNumber?: string;
  customerName?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AnalyticsSummary {
  totalRevenue?: number;
  totalCleanings?: number;
  totalCustomers?: number;
  [key: string]: unknown;
}

export interface CustomerAnalytics {
  customerId: number | string;
  customerName: string;
  totalRevenue?: number;
  totalCleanings?: number;
  lastCleaningDate?: string;
  [key: string]: unknown;
}

