import { Request, Response } from 'express';
import Tutor, { ITutor } from '../models/Tutor';

export const applyAsTutor = async (req: Request, res: Response) => {
  const { name, country, email, phone, videoLink, description, languages } = req.body;
  try {
    const newTutor: ITutor = new Tutor({ name, country, email, phone, videoLink, description, languages });
    await newTutor.save();
    res.status(201).json(newTutor);
  } catch (err) {
    res.status(500).json({ message: 'Error applying as tutor', error: err });
  }
};

export const searchTutors = async (req: Request, res: Response) => {
    const { language, country } = req.query;
    try {
      const tutors = await Tutor.find({ languages: { $elemMatch: { language } }, country, isApproved: true });
      res.status(200).json(tutors);
    } catch (err) {
      res.status(500).json({ message: 'Error searching tutors', error: err });
    }
  };

  export const approveTutor = async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    try {
      const tutor = await Tutor.findByIdAndUpdate(tutorId, { isApproved: true }, { new: true });
      res.status(200).json(tutor);
    } catch (err) {
      res.status(500).json({ message: 'Approval failed', error: err });
    }
  };