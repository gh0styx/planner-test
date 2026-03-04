import { Request, Response } from 'express';
import { Task } from '../models/Task';

export async function getTasks(req: Request, res: Response): Promise<void> {
  const { from, to } = req.query;
  if (typeof from !== 'string' || typeof to !== 'string') {
    res.status(400).json({ error: 'Query params "from" and "to" are required (YYYY-MM-DD)' });
    return;
  }
  const tasks = await Task.find({ date: { $gte: from, $lte: to } }).sort({ date: 1, order: 1 });
  res.json(tasks);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const { title, date, color } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'Valid date is required (YYYY-MM-DD)' });
    return;
  }

  const maxOrder = await Task.findOne({ date }).sort({ order: -1 }).select('order');
  const order = maxOrder ? maxOrder.order + 1 : 0;

  const task = await Task.create({
    title: title.trim(),
    date,
    order,
    color: color || '#0079bf',
  });
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, date, order, color } = req.body;

  const update: Record<string, unknown> = {};
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }
    update.title = title.trim();
  }
  if (date !== undefined) update.date = date;
  if (order !== undefined) update.order = order;
  if (color !== undefined) update.color = color;

  const task = await Task.findByIdAndUpdate(id, update, { new: true });
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json({ message: 'Task deleted' });
}

export async function reorderTasks(req: Request, res: Response): Promise<void> {
  const { tasks } = req.body;
  if (!Array.isArray(tasks)) {
    res.status(400).json({ error: 'tasks array is required' });
    return;
  }

  const ops = tasks.map((t: { _id: string; date: string; order: number }) => ({
    updateOne: {
      filter: { _id: t._id },
      update: { $set: { date: t.date, order: t.order } },
    },
  }));

  await Task.bulkWrite(ops);
  res.json({ message: 'Tasks reordered' });
}
