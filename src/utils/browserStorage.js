// Read persisted JSON defensively so malformed or unavailable browser storage cannot block startup.
export const readStoredValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const readStoredArray = (key) => {
  const value = readStoredValue(key, []);
  return Array.isArray(value) ? value : [];
};

export const writeStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable or full; keep the app usable for the current session.
  }
};
