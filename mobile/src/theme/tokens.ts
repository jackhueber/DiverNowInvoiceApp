export const colors = {
  background: '#020617', // slate-950
  surface: '#020617',
  surfaceMuted: '#0f172a',
  border: '#1f2937',
  primary: '#2563eb', // blue-600
  primarySoft: '#60a5fa', // blue-400
  primaryTextOnDark: '#0b1120',
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  danger: '#ef4444',
  dangerSoft: '#fca5a5',
  white: '#ffffff',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const text = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
  },
} as const;

