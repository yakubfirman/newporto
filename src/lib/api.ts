export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string | null;
  tech_stack: string[];
  url: string | null;
  github_url: string | null;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  name: string;
  content: string;
  parent_id: number | null;
  is_approved: boolean;
  created_at: string;
  replies?: Comment[];
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  likes: number;
  comments_count?: number;
  comments?: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_svg?: string;
  is_highlighted: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  if (!response.ok) {
    throw new Error(`Failed to fetch from API: ${response.statusText}`);
  }

  return response.json();
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    return await fetchAPI<Record<string, string>>('/settings');
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function fetchAdminAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  if (response.status === 401) {
    // Optionally handle token expiration by redirecting or clearing token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch from Admin API: ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export async function uploadFile(file: File): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const formData = new FormData();
  formData.append('image', file);

  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  // Let the browser set Content-Type to multipart/form-data with boundary

  const response = await fetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload file');
  }

  const data = await response.json();
  return data.url;
}
