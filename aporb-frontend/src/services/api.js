const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let authToken = null;

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('aporb_token');
}

function saveToken(token) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('aporb_token', token);
}

function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('aporb_token');
}

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    saveToken(token);
  } else {
    clearToken();
  }
}

export function clearAuthToken() {
  authToken = null;
  clearToken();
}

function buildHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };

  if (includeAuth) {
    const token = authToken || getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders(options.includeAuth !== false),
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}

function normalizeUser(user) {
  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();

  return {
    id: user.id,
    name: fullName || user.username || user.name || 'Usuario',
    username: user.username || user.name || '',
    email: user.email || '',
    password: '',
    description: user.bio || user.description || '',
    interests: user.location || user.interests || '',
    avatar: user.avatar_url || user.avatar || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    bio: user.bio || '',
    location: user.location || '',
  };
}

function normalizePost(post) {
  if (!post) return null;

  return {
    id: post.id,
    userId: post.user_id ?? post.userId,
    username: post.username || '',
    avatarUrl: post.avatar_url || post.avatar || '',
    title: post.title || '',
    category: post.category_name || post.category || 'Otros',
    description: post.description || '',
    details: post.details || '',
    location: post.location || '',
    condition: post.condition || '',
    created: post.created_at ? new Date(post.created_at).toLocaleString() : post.created || '',
    createdAt: post.created_at || post.createdAt || '',
    authorName: post.username || [post.first_name, post.last_name].filter(Boolean).join(' ').trim() || 'Anónimo',
    authorAvatar: post.avatar_url || post.avatar || '',
    media: (post.media || []).map((item, index) => ({
      id: item.id ?? index,
      name: item.file_name || item.fileName || item.name || 'media',
      type: item.file_type || item.fileType || item.type || 'image',
      src: item.file_url || item.fileUrl || item.src || '',
    })),
  };
}

export async function loginUser(credentials) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.token) {
    setAuthToken(response.token);
  }

  return {
    ...response,
    user: normalizeUser(response.user),
  };
}

export async function registerUser(credentials) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return {
    ...response,
    user: normalizeUser(response.user),
  };
}

export async function getCurrentUser() {
  const response = await request('/users/me');
  return {
    ...response,
    user: normalizeUser(response.user),
  };
}

export async function updateCurrentUser(payload) {
  const response = await request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return {
    ...response,
    user: normalizeUser(response.user),
  };
}

export async function getPosts() {
  const response = await request('/posts');
  return {
    ...response,
    posts: (response.posts || []).map(normalizePost).filter(Boolean),
  };
}

export async function createPost(payload) {
  const response = await request('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    ...response,
    post: normalizePost(response.post),
  };
}

export async function getMyPosts() {
  const response = await request('/posts/me');
  return {
    ...response,
    posts: (response.posts || []).map(normalizePost).filter(Boolean),
  };
}

export async function getCategories() {
  const response = await request('/categories');
  return response.categories || [];
}

export { normalizeUser, normalizePost };
