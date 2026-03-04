export interface Task {
  _id: string;
  title: string;
  date: string;
  order: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreatePayload {
  title: string;
  date: string;
  color: string;
}

export interface TaskUpdatePayload {
  title?: string;
  date?: string;
  order?: number;
  color?: string;
}

export interface ReorderPayload {
  tasks: { _id: string; date: string; order: number }[];
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const LABEL_COLORS = [
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#3b82f6',
  '#a855f7',
] as const;
