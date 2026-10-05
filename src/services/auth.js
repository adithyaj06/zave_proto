const tokenKey = 'zave-auth-token';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const request = async (path, options = {}) => {
  const token = localStorage.getItem(tokenKey);
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach the authentication server. Check that the backend is deployed and VITE_API_BASE_URL is configured.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The authentication API is not available on this deployment. Deploy the backend and configure VITE_API_BASE_URL.');
  }

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
