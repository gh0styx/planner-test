import axios from 'axios';
import type { Task, TaskCreatePayload, TaskUpdatePayload, ReorderPayload } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: BASE_URL });

export async function fetchTasks(from: string, to: string): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks', { params: { from, to } });
  return data;
}

export async function createTask(payload: TaskCreatePayload): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
}

export async function updateTask(id: string, payload: TaskUpdatePayload): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function reorderTasks(payload: ReorderPayload): Promise<void> {
  await api.put('/tasks/reorder', payload);
}
