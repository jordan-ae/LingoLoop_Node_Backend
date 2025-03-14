import { Request, Response } from 'express';
import Lesson from "../models/Lesson";
import User from "../models/User";
import Tutor from "../models/Tutor";

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

export const getAllTutors = async (req: Request, res: Response) => {
    try {
        // First get all users with tutor role
        const tutorUsers = await User.find({ role: 'tutor' }).select('-password');
        
        // Get the corresponding Tutor documents for these users
        const tutors = await Promise.all(tutorUsers.map(async (user) => {
            const tutorProfile = await Tutor.findOne({ user: user.id });
            return {
                ...user.toObject(),
                tutorProfile
            };
        }));
        
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tutors' });
    }
};

export const getTotalUsers = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user count' });
    }
};