import { createServer } from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 8787);
const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data', 'users.json');
const sessions = new Map();

const sendJson = (response, status, payload) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5174',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  response.end(JSON.stringify(payload));
};

const readUsers = async () => {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'));
  } catch {
    return [];
  }
};

const writeUsers = (users) => writeFile(dataFile, JSON.stringify(users, null, 2));

const hashPassword = (password, salt = randomBytes(16).toString('hex')) => ({
  salt,
  hash: scryptSync(password, salt, 64).toString('hex'),
});

const passwordsMatch = (password, user) => {
  const candidate = scryptSync(password, user.salt, 64);
  const stored = Buffer.from(user.passwordHash, 'hex');
  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
};

const readBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch {
      reject(new Error('Invalid JSON'));
    }
  });
  request.on('error', reject);
});

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

const getUserFromRequest = async (request) => {
  const token = request.headers.authorization?.replace('Bearer ', '');
  const userId = token && sessions.get(token);
  if (!userId) return null;
  const users = await readUsers();
  return users.find((user) => user.id === userId) || null;
};

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5174',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    response.end();
    return;
  }

  try {
    if (request.method === 'POST' && request.url === '/api/auth/register') {
      const { name, email, password } = await readBody(request);
      if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
        sendJson(response, 400, { message: 'Name, email, and a password of at least 8 characters are required.' });
        return;
      }

      const users = await readUsers();
      const normalizedEmail = email.trim().toLowerCase();
      if (users.some((user) => user.email === normalizedEmail)) {
        sendJson(response, 409, { message: 'An account with that email already exists.' });
        return;
      }

      const { salt, hash } = hashPassword(password);
      const user = { id: randomBytes(12).toString('hex'), name: name.trim(), email: normalizedEmail, salt, passwordHash: hash };
      users.push(user);
      await mkdir(dirname(dataFile), { recursive: true });
      await writeUsers(users);
      const token = randomBytes(32).toString('hex');
      sessions.set(token, user.id);
      sendJson(response, 201, { token, user: publicUser(user) });
      return;
    }

    if (request.method === 'POST' && request.url === '/api/auth/login') {
      const { email, password } = await readBody(request);
      const users = await readUsers();
      const user = users.find((candidate) => candidate.email === email?.trim().toLowerCase());
      if (!user || !password || !passwordsMatch(password, user)) {
        sendJson(response, 401, { message: 'Invalid email or password.' });
        return;
      }

      const token = randomBytes(32).toString('hex');
      sessions.set(token, user.id);
      sendJson(response, 200, { token, user: publicUser(user) });
      return;
    }

    if (request.method === 'POST' && request.url === '/api/auth/logout') {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (token) sessions.delete(token);
      sendJson(response, 200, { message: 'Signed out.' });
      return;
    }

    if (request.method === 'GET' && request.url === '/api/auth/me') {
      const user = await getUserFromRequest(request);
      if (!user) {
        sendJson(response, 401, { message: 'Not authenticated.' });
        return;
      }
      sendJson(response, 200, { user: publicUser(user) });
      return;
    }

    sendJson(response, 404, { message: 'Not found.' });
  } catch (error) {
    sendJson(response, 500, { message: error.message || 'Server error.' });
  }
});

server.listen(port, () => {
  console.log(`Zave API listening at http://localhost:${port}`);
});
