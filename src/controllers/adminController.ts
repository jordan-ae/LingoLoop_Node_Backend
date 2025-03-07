import { Request, Response } from 'express';
import Lesson from "../models/Lesson";
import User from "../models/User";

export const suspendUser = async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User suspended' });
};

export const getPaymentHistory = async (req: Request, res: Response) => {
    const payments = await Lesson.find({}).populate([
      { path: 'student' },
      { path: 'tutor' }
    ]);
    res.json(payments);
  };