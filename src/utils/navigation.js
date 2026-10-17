/**
 * Dynamic URL resolver for Admin Portal
 * - In local development: links to dedicated port 5175
 * - On Vercel / production: links to unified /admin route
 */
export const getAdminUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5175';
    }
    return '/admin';
  }
  return '/admin';
};
