/**
 * Helper to replace {{var}} or {var} in strings
 * This utility is server-safe (no 'use client').
 */
export const interpolate = (str: any, params: Record<string, string | number>) => {
  if (!str) return "";
  let result = typeof str === 'string' ? str : String(str);
  
  Object.entries(params).forEach(([key, val]) => {
    const safeVal = val !== undefined && val !== null ? val.toString() : "";
    const regex = new RegExp(`(\\{\\{${key}\\}\\}|\\{${key}\\})`, 'g');
    result = result.replace(regex, safeVal);
  });
  
  return result;
};
