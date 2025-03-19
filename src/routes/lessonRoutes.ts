import express from 'express';
import { createLesson, createClassroom } from '../controllers/lessonController';

const router = express.Router();

// Create a new lesson
router.post('/', createLesson);

// Create a classroom for a lesson
router.post('/:lessonId/classroom');

export default router; 