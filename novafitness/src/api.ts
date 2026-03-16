export interface User {
  email: string;
}

export interface WorkoutPlan {
  id: number;
  planDate: string;
  exerciseSlug: string;
  exerciseName: string;
  sets: number;
  reps: number;
  notes: string;
}

export interface ProgressLog {
  id: number;
  exerciseSlug: string;
  exerciseName: string;
  weight: number;
  loggedAt: string;
  notes: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api';
const apiPath = (path: string) => `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;

const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(apiPath(path), {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // no-op
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
};

export const api = {
  register: (payload: { email: string; password: string }) =>
    apiRequest<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiRequest<{ user: User }>('/auth/me'),
  logout: () => apiRequest<{ ok: true }>('/auth/logout', { method: 'POST' }),

  getWorkoutPlans: (month: string) =>
    apiRequest<{ plans: WorkoutPlan[] }>(`/workout-plans?month=${encodeURIComponent(month)}`),
  createWorkoutPlan: (payload: Omit<WorkoutPlan, 'id'>) =>
    apiRequest<{ plan: WorkoutPlan }>('/workout-plans', { method: 'POST', body: JSON.stringify(payload) }),
  deleteWorkoutPlan: (id: number) =>
    apiRequest<{ ok: true }>(`/workout-plans/${id}`, { method: 'DELETE' }),

  getProgressLogs: (search = '') =>
    apiRequest<{ logs: ProgressLog[] }>(`/progress?search=${encodeURIComponent(search)}`),
  createProgressLog: (payload: Omit<ProgressLog, 'id'>) =>
    apiRequest<{ log: ProgressLog }>('/progress', { method: 'POST', body: JSON.stringify(payload) }),
  deleteProgressLog: (id: number) =>
    apiRequest<{ ok: true }>(`/progress/${id}`, { method: 'DELETE' }),

  updateEmail: (payload: { newEmail: string; password: string }) =>
    apiRequest<{ user: User }>('/settings/email', { method: 'PATCH', body: JSON.stringify(payload) }),
  updatePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ ok: true }>('/settings/password', { method: 'PATCH', body: JSON.stringify(payload) }),

  chatWithAiCoach: (payload: { message: string; history: ChatMessage[] }) =>
    apiRequest<{ reply: string }>('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
};
