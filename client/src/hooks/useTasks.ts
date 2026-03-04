import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskCreatePayload, TaskUpdatePayload, ReorderPayload } from '../types';
import * as api from '../api/tasksApi';
import { getDateRange } from '../utils/dateHelpers';

export function useTasks(year: number, month: number) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => {
    const { from, to } = getDateRange(year, month);
    try {
      const data = await api.fetchTasks(from, to);
      setTasks(data);
    } catch {
      console.error('Failed to load tasks');
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = useCallback(async (payload: TaskCreatePayload) => {
    try {
      const task = await api.createTask(payload);
      setTasks((prev) => [...prev, task]);
    } catch {
      console.error('Failed to create task');
    }
  }, []);

  const updateTask = useCallback(async (id: string, payload: TaskUpdatePayload) => {
    try {
      const updated = await api.updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch {
      console.error('Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      console.error('Failed to delete task');
    }
  }, []);

  const reorderTasks = useCallback(async (payload: ReorderPayload) => {
    setTasks((prev) => {
      const updated = new Map(payload.tasks.map((t) => [t._id, t]));
      return prev.map((task) => {
        const upd = updated.get(task._id);
        if (upd) return { ...task, date: upd.date, order: upd.order };
        return task;
      });
    });
    try {
      await api.reorderTasks(payload);
    } catch {
      console.error('Failed to reorder tasks');
      load();
    }
  }, [load]);

  return { tasks, createTask, updateTask, deleteTask, reorderTasks };
}
