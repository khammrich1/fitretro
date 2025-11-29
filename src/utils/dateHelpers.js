/**
 * Date and time helper functions
 */

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

export const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

export const getEndOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const wasYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

export default {
  getCurrentTimestamp,
  formatDate,
  formatTime,
  formatDateTime,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getDaysDifference,
  isSameDay,
  isToday,
  wasYesterday,
};
