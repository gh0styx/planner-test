import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import tasksRouter from './routes/tasks';

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/tasks', tasksRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
