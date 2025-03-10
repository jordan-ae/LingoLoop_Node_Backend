import express from 'express';
import { getAllTutors, getTotalUsers } from '../controllers/adminController';

const router = express.Router();

router.get('/tutors', getAllTutors);
router.get('/total-users', getTotalUsers);

export default router; 