import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CHURCH_TIMEZONE = 'Africa/Johannesburg';

export function formatDateTime(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return date.toLocaleDateString('en-ZA', {
    timeZone: CHURCH_TIMEZONE,
    ...options
  });
}

export function formatTime(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return date.toLocaleTimeString('en-ZA', {
    timeZone: CHURCH_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
}
