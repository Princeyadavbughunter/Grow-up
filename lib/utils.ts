import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();

  // Handle negative differences (future dates or clock skew) and very recent comments
  if (diffInMilliseconds < 0 || diffInMilliseconds < 60000) { // Less than 1 minute
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * Sanitizes file names for safe display in the UI
 * Prevents XSS attacks by escaping HTML characters and limiting length
 */
export function sanitizeFileName(fileName: string, maxLength: number = 50): string {
  if (!fileName) return '';

  // Escape HTML characters to prevent XSS
  const escaped = fileName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Limit length and add ellipsis if needed
  if (escaped.length <= maxLength) {
    return escaped;
  }

  // Find a good break point (preferably at a space or common separator)
  const truncated = escaped.substring(0, maxLength - 3);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const lastDotIndex = truncated.lastIndexOf('.');

  // Break at space if available and not too far back
  if (lastSpaceIndex > maxLength * 0.7) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }

  // Otherwise break at file extension boundary if reasonable
  if (lastDotIndex > maxLength * 0.5 && lastDotIndex < maxLength - 10) {
    return truncated.substring(0, lastDotIndex) + '...';
  }

  // Default truncation
  return truncated + '...';
}