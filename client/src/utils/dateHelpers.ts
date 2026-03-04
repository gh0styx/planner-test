import type { CalendarDay } from '../types';

export function getMonthData(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = formatDate(today);

  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const date = new Date(year, month - 1, d);
    days.push({
      date: formatDate(date),
      day: d,
      isCurrentMonth: false,
      isToday: formatDate(date) === todayStr,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date: formatDate(date),
      day: d,
      isCurrentMonth: true,
      isToday: formatDate(date) === todayStr,
    });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    days.push({
      date: formatDate(date),
      day: d,
      isCurrentMonth: false,
      isToday: formatDate(date) === todayStr,
    });
  }

  return days;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[month] ?? '';
}

export function getDateRange(year: number, month: number) {
  const days = getMonthData(year, month);
  return {
    from: days[0]!.date,
    to: days[days.length - 1]!.date,
  };
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
