// Read persisted JSON arrays defensively so malformed browser storage cannot block app startup.
export const readStoredArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
