import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import Tutor from '../models/Tutor';
import { stripe } from '../utils/stripe';

async function isTutorAvailable(tutor: import("mongoose").Document<unknown, {}, import("../models/Tutor").ITutor> & import("../models/Tutor").ITutor & Required<{ _id: unknown; }> & { __v: number; }, startTime: Date, endTime: Date): Promise<boolean> {
    // Check for overlapping lessons
    const overlappingLessons = await Lesson.find({
        tutor: tutor._id,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    return overlappingLessons.length === 0;
}

export const bookLesson = async (req: Request & { user: { userId: string } }, res: Response) => {
  const { tutorId, startTime, endTime } = req.body;
  const studentId = req.user.userId;

  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    // Check tutor availability
    const isAvailable = await isTutorAvailable(tutor, startTime, endTime);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Tutor not available' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tutor.pricePerHour * 100, // Convert to cents
      currency: 'usd',
      metadata: { tutorId, studentId, startTime, endTime }
    });

    // Save lesson with payment intent ID
    const lesson = new Lesson({
      student: studentId,
      tutor: tutorId,
      startTime,
      endTime,
      price: tutor.pricePerHour,
      paymentStatus: 'pending',
      paymentIntentId: paymentIntent.id
    });
    await lesson.save();

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err });
  }
};