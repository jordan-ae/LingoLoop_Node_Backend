import express from 'express';
import { applyAsTutor, searchTutors } from '../controllers/tutorController';

const router = express.Router();

router.post('/apply', applyAsTutor);
router.get('/search', searchTutors);

export default router;