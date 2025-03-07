import express, { Request, Response } from 'express';
import { applyAsTutor, searchTutors, updateTutorDetails, MulterRequest } from '../controllers/tutorController';

const router = express.Router();

router.put('/apply', async (req: Request, res: Response) => {
  try {
    await applyAsTutor(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/search', async (req: Request, res: Response) => {
  try {
    await searchTutors(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/:id/update', async (req: Request, res: Response) => {
  try {
    await updateTutorDetails(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;