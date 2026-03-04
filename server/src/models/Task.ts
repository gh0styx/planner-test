import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  date: string;
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    order: { type: Number, required: true, default: 0 },
    color: { type: String, default: '#0079bf' },
  },
  { timestamps: true },
);

taskSchema.index({ date: 1, order: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
