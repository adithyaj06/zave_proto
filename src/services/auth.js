const tokenKey = 'zave-auth-token';

const request = async (path, options = {}) => {
  const token = localStorage.getItem(tokenKey);
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Request failed.');
  return payload;
};

const saveSession = ({ token, user }) => {
  localStorage.setItem(tokenKey, token);
  return user;
};

export const login = async (credentials) => saveSession(await request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
}));

export const register = async (credentials) => saveSession(await request('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(credentials),
}));

export const getCurrentUser = async () => {
  if (!localStorage.getItem(tokenKey)) return null;
  try {
    return (await request('/api/auth/me')).user;
  } catch {
    localStorage.removeItem(tokenKey);
    return null;
  }
};

export const logout = async () => {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem(tokenKey);
  }
};
