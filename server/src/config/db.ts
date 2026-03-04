import mongoose from 'mongoose';

let cached: typeof mongoose | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar-planner';
  cached = await mongoose.connect(uri);
  console.log('MongoDB connected');
  return cached;
}
