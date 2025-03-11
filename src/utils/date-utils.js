import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  formatDistanceToNow,
} from 'date-fns';

// Format date for display
export function formatDate(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d, yyyy');
  }
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  return formatDistanceToNow(date, { addFuffix: true });
}

export function formatDateForInput(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  return format(date, 'yyyy-MM-dd');
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;

  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
}
