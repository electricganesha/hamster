import { endOfDay, startOfDay, subDays } from 'date-fns';

export const formatUtc = (dateString: string, fmt: string) => {
  const date = new Date(dateString);
  // Use UTC fields for formatting
  if (fmt === 'yyyy-MM-dd') {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }
  if (fmt === 'HH:mm') {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
  }
  return date.toISOString();
};

export const getInitialDateRange = (): [Date | null, Date | null] => {
  const today = new Date();
  const start = startOfDay(subDays(today, 14)); // 15 days including today
  const end = endOfDay(today);
  return [start, end];
};
