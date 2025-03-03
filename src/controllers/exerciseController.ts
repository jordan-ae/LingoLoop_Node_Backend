import { Request, Response } from 'express';
import Exercise from '../models/Exercise';

export const getExercises = async (req: Request, res: Response) => {
  const { type } = req.query;
  try {
    const exercises = await Exercise.find({ type });
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exercises', error: err });
  }
};