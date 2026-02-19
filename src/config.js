export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api/v1';

// Always read fresh from localStorage
export const getToken = () => localStorage.getItem('token');

// For backward compatibility - but use getToken() going forward
export const token = localStorage.getItem('token');

export function getUserId() {
  const userString = localStorage.getItem('user');
  if (!userString || userString === 'null') return null;
  try {
    const userObject = JSON.parse(userString);
    return userObject?._id || null;
  } catch {
    return null;
  }
}

export function getIsPremiumUser() {
  const userString = localStorage.getItem('user');
  if (!userString || userString === 'null') return false;
  try {
    const userObject = JSON.parse(userString);
    return userObject?.isPremiumUser === true;
  } catch {
    return false;
  }
}