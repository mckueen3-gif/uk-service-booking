export function getLocalizedData(t: any, key: string, namespace: string, fallback?: string): string {
  if (!t || !key) return fallback || key;
  
  // Try to find the localized value in the specified namespace
  const localizedValue = t?.common?.[namespace]?.[key.toLowerCase()];
  
  if (localizedValue) return localizedValue;
  
  // If not found, try to format the key (capitalize, remove underscores)
  return fallback || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getLocalizedSubject(t: any, subject: string): string {
  return getLocalizedData(t, subject, 'subjects');
}

export function getLocalizedLocation(t: any, location: string): string {
  // If explicitly "United Kingdom" or "UK", return it or a localized version
  if (location?.toLowerCase() === 'united kingdom' || location?.toLowerCase() === 'uk') {
    return t?.common?.locations?.uk || "United Kingdom";
  }
  return getLocalizedData(t, location, 'locations');
}

export function getLocalizedMode(t: any, mode: string): string {
  return getLocalizedData(t, mode, 'modes');
}
