import { Request, Response } from 'express';
import Tutor, { ITutor } from '../models/Tutor';
import multer from 'multer';
import User from '../models/User';

export interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export const applyAsTutor = async (req: Request, res: Response) => {
  const { userId, phone, country, videoLink, bio, languages } = req.body;

  // Basic validation
  if (!userId || !phone || !country || !videoLink || !bio || !languages) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate video link format
  const videoLinkPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/i;
  if (!videoLinkPattern.test(videoLink)) {
    return res.status(400).json({ message: 'Please provide a valid YouTube or Vimeo link' });
  }

  // Validate bio length
  if (bio.length < 100) {
    return res.status(400).json({ message: 'Bio must be at least 100 characters' });
  }

  // Validate languages
  if (!Array.isArray(languages) || languages.length === 0) {
    return res.status(400).json({ message: 'At least one language is required' });
  }

  for (const lang of languages) {
    if (!lang.name || !['beginner', 'intermediate', 'advanced', 'native'].includes(lang.proficiency)) {
      return res.status(400).json({ message: 'Invalid language data' });
    }
  }

  try {
    // Create new tutor document with user reference
    const newTutor = new Tutor({
      user: userId,
      phone,
      country,
      videoLink,
      bio,
      languages,
      status: 'pending'
    });

    await newTutor.save();

    res.status(200).json({
      message: 'Tutor application submitted successfully',
      tutor: {
        id: newTutor._id,
        user: newTutor.user,
        status: newTutor.status
      }
    });
  } catch (err: unknown) {
    console.error('Error applying as tutor:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error processing your application', error: errorMessage });
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

export const updateTutorDetails = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { 
    phone,
    country,
    videoLink,
    bio,
    languages,
    pricePerHour,
    availability,
    status
  } = req.body;

  // Basic validation
  if (!phone && !country && !videoLink && !bio && !languages && !pricePerHour && !availability) {
    return res.status(400).json({ message: 'At least one field must be provided for update' });
  }

  // Validate video link format if provided
  if (videoLink) {
    const videoLinkPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/i;
    if (!videoLinkPattern.test(videoLink)) {
      return res.status(400).json({ message: 'Please provide a valid YouTube or Vimeo link' });
    }
  }

  // Validate bio length if provided
  if (bio && bio.length < 100) {
    return res.status(400).json({ message: 'Bio must be at least 100 characters' });
  }

  // Validate languages if provided
  if (languages) {
    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({ message: 'At least one language is required' });
    }

    for (const lang of languages) {
      if (!lang.language || !['beginner', 'intermediate', 'advanced', 'native'].includes(lang.proficiency)) {
        return res.status(400).json({ message: 'Invalid language data' });
      }
    }
  }

  // Validate price if provided
  if (pricePerHour && (typeof pricePerHour !== 'number' || pricePerHour <= 0)) {
    return res.status(400).json({ message: 'Price per hour must be a positive number' });
  }

  // Validate availability if provided
  if (availability && !Array.isArray(availability)) {
    return res.status(400).json({ message: 'Availability must be an array' });
  }

  try {
    const updateData: Partial<ITutor> = {
      ...(phone && { phone }),
      ...(country && { country }),
      ...(videoLink && { videoLink }),
      ...(bio && { bio }),
      ...(languages && { languages }),
      ...(pricePerHour && { pricePerHour }),
      ...(availability && { availability }),
      status: 'pending'
    };

    // Find and update by user reference
    const updatedTutor = await Tutor.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.status(200).json({
      message: 'Tutor details updated successfully',
      tutor: updatedTutor
    });
  } catch (err: unknown) {
    console.error('Error updating tutor details:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error updating tutor details', error: errorMessage });
  }
};

export const getTutorByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    const tutor = await Tutor.findOne({ user: userId });
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    res.status(200).json(tutor);
  } catch (err: unknown) {
    console.error('Error fetching tutor:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching tutor details', error: errorMessage });
  }
};