const API_BASE_URL = 'http://localhost:8080/api';

// User API
export const userApi = {
  getAll: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/users/${id}`).then(res => res.json()),
  create: (user: any) => fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(res => res.json()),
  update: (id: number, user: any) => fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' })
};

// Workout API
export const workoutApi = {
  getAll: () => fetch(`${API_BASE_URL}/workouts`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/workouts/${id}`).then(res => res.json()),
  getByUserId: (userId: number) => fetch(`${API_BASE_URL}/workouts/user/${userId}`).then(res => res.json()),
  create: (workout: any) => fetch(`${API_BASE_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout)
  }).then(res => res.json()),
  update: (id: number, workout: any) => fetch(`${API_BASE_URL}/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE_URL}/workouts/${id}`, { method: 'DELETE' })
};

// Goal API
export const goalApi = {
  getAll: () => fetch(`${API_BASE_URL}/goals`).then(res => res.json()),
  getById: (id: number) => fetch(`${API_BASE_URL}/goals/${id}`).then(res => res.json()),
  getByUserId: (userId: number) => fetch(`${API_BASE_URL}/goals/user/${userId}`).then(res => res.json()),
  create: (goal: any) => fetch(`${API_BASE_URL}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal)
  }).then(res => res.json()),
  update: (id: number, goal: any) => fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal)
  }).then(res => res.json()),
  delete: (id: number) => fetch(`${API_BASE_URL}/goals/${id}`, { method: 'DELETE' })
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.ok;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
};