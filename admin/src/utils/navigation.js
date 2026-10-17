/**
 * Dynamic URL & API Base resolver for Admin Portal
 * - In local development (port 5175): links to port 5174
 * - On Vercel / production: links to root '/' and uses relative API calls
 */
export const getStorefrontUrl = () => {
  if (typeof window !== 'undefined') {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5175') {
      return 'http://localhost:5174';
    }
    return '/';
  }
  return '/';
};

export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5175') {
      return 'http://localhost:5174';
    }
    return '';
  }
  return '';
};
