// Centralized cookie configuration for authentication tokens
// This ensures consistency across login, logout, and AuthContext

export const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'lax' as const, // 'lax' works better for OAuth redirects and page reloads
  path: '/', // Make cookie available site-wide
};

// Cookie names
export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  USER_ID_VALUE: 'user_id_value',
} as const;

