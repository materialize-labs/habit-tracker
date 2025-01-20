import { format, startOfDay } from 'date-fns';

/**
 * Gets the local date string (YYYY-MM-DD) for database operations
 * Always uses local timezone
 */
export function getLocalDateString(date: Date = new Date()): string {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

/**
 * Compares two dates (ignoring time) to check if first is after second
 */
export function isDateAfter(date1: Date, date2: Date): boolean {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  return d1 > d2;
}

/**
 * Gets start of today in user's local timezone
 */
export function getToday(): Date {
  return startOfDay(new Date());
}

/**
 * Checks if a date is in the future (compared to local today)
 */
export function isInFuture(date: Date): boolean {
  return isDateAfter(date, getToday());
} 