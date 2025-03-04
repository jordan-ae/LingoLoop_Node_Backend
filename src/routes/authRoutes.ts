import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    await register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

export default router;