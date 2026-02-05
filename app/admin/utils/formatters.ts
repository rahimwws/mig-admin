import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Format currency in Russian rubles
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

// Format date in Russian locale
export function formatDate(dateString: string, formatStr: string = 'dd.MM.yyyy'): string {
  try {
    return format(new Date(dateString), formatStr, { locale: ru });
  } catch {
    return dateString;
  }
}

// Format datetime
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'dd.MM.yyyy HH:mm');
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ru,
    });
  } catch {
    return dateString;
  }
}

// Format area in square meters
export function formatArea(area: number): string {
  return `${formatNumber(area)} м²`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Format short ID (for display)
export function formatShortId(id: string): string {
  if (id.length <= 8) return id;
  return id.slice(0, 8);
}

// Format phone number
export function formatPhone(phone: string): string {
  // Simple formatting - assumes Russian phone format
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

// Get initials from name
export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
