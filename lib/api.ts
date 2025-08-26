// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

interface RequestOptions extends RequestInit {
  token?: string; // Optional token for authenticated requests
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { headers, token, ...rest } = options;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.detail || errorData.message || "An unknown error occurred");
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(data), ...options }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(data), ...options }),
  delete: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { method: "DELETE", ...options }),
};

export const loginUser = async (credentials: LoginCredentials): Promise<Token> => {
  const params = new URLSearchParams();
  params.append('username', credentials.username);
  params.append('password', credentials.password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.detail || errorData.message || "An unknown error occurred");
  }

  return response.json();
};

// Example of an authenticated request
export const fetchAdminStats = async (token: string) => {
  return await api.get('/admin/dashboard/stats', { token });
};
