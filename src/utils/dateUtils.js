import { format, parseISO, isToday, isTomorrow, isThisWeek, isAfter, subDays } from 'date-fns';

/**
 * Safe date utilities to handle null/undefined values from database
 */

export const safeParseISO = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  try {
    return parseISO(dateString);
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return null;
  }
};

export const safeFormat = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    // Handle string dates
    if (typeof date === 'string') {
      const parsedDate = safeParseISO(date);
      if (!parsedDate) return '';
      return format(parsedDate, formatStr);
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      if (isNaN(date.getTime())) return '';
      return format(date, formatStr);
    }
    
    return '';
  } catch (error) {
    console.warn('Error formatting date:', date, error);
    return '';
  }
};

export const safeIsToday = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? safeParseISO(date) : date;
    if (!parsedDate) return false;
    return isToday(parsedDate);
  } catch (error) {
    return false;
  }
};

export const safeIsTomorrow = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? safeParseISO(date) : date;
    if (!parsedDate) return false;
    return isTomorrow(parsedDate);
  } catch (error) {
    return false;
  }
};

export const safeIsThisWeek = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? safeParseISO(date) : date;
    if (!parsedDate) return false;
    return isThisWeek(parsedDate);
  } catch (error) {
    return false;
  }
};

export const safeIsAfter = (date, compareDate) => {
  if (!date || !compareDate) return false;
  try {
    const parsedDate = typeof date === 'string' ? safeParseISO(date) : date;
    const parsedCompareDate = typeof compareDate === 'string' ? safeParseISO(compareDate) : compareDate;
    if (!parsedDate || !parsedCompareDate) return false;
    return isAfter(parsedDate, parsedCompareDate);
  } catch (error) {
    return false;
  }
};

export const safeSubDays = (date, amount) => {
  if (!date) return null;
  try {
    const parsedDate = typeof date === 'string' ? safeParseISO(date) : date;
    if (!parsedDate) return null;
    return subDays(parsedDate, amount);
  } catch (error) {
    return null;
  }
};

export const createSafeDate = (dateValue) => {
  if (!dateValue) return null;
  
  try {
    // If it's already a Date object, validate it
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    
    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Try to convert other types to Date
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Error creating date:', dateValue, error);
    return null;
  }
};