import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import tutorRoutes from './routes/tutorRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import authRoutes from './routes/authRoutes';
import { authenticate } from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
// app.use('/api/tutors', (req, res, next) => {
//   authenticate(req, res, next);
//   return;
// }, tutorRoutes);
// app.use('/api/exercises', (req, res, next) => {
//   authenticate(req, res, next);
//   return;
// }, exerciseRoutes);

const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;