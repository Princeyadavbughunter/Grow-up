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

// Rate limiting utilities for comments
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      // First request
      this.limits.set(key, { count: 1, resetTime: now + this.config.windowMs });
      return false;
    }

    if (now > entry.resetTime) {
      // Reset window
      this.limits.set(key, { count: 1, resetTime: now + this.config.windowMs });
      return false;
    }

    if (entry.count >= this.config.maxRequests) {
      return true;
    }

    // Increment counter
    entry.count += 1;
    this.limits.set(key, entry);
    return false;
  }

  getRemainingTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  getRemainingRequests(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return this.config.maxRequests;

    const now = Date.now();
    if (now > entry.resetTime) return this.config.maxRequests;

    return Math.max(0, this.config.maxRequests - entry.count);
  }
}

// Comment rate limiter - 5 comments per minute per user
export const commentRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
});

// Reply rate limiter - 10 replies per minute per user
export const replyRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

export function checkCommentRateLimit(userId: string): { allowed: boolean; remainingTime?: number; remainingRequests?: number } {
  const key = `comment_${userId}`;
  const isLimited = commentRateLimiter.isRateLimited(key);

  return {
    allowed: !isLimited,
    remainingTime: isLimited ? commentRateLimiter.getRemainingTime(key) : undefined,
    remainingRequests: commentRateLimiter.getRemainingRequests(key)
  };
}

export function checkReplyRateLimit(userId: string): { allowed: boolean; remainingTime?: number; remainingRequests?: number } {
  const key = `reply_${userId}`;
  const isLimited = replyRateLimiter.isRateLimited(key);

  return {
    allowed: !isLimited,
    remainingTime: isLimited ? replyRateLimiter.getRemainingTime(key) : undefined,
    remainingRequests: replyRateLimiter.getRemainingRequests(key)
  };
}

export function formatRateLimitMessage(remainingTime: number): string {
  const seconds = Math.ceil(remainingTime / 1000);
  if (seconds < 60) {
    return `Too many comments. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before trying again.`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `Too many comments. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`;
}