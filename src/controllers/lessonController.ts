import axios from 'axios';
import { Request, Response } from 'express';
import Lesson from '../models/Lesson';

export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Call the Daily.co API to create a room
    const response = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
          start_audio_off: true,
          start_video_off: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`, // Set this in your .env file
          'Content-Type': 'application/json',
        },
      }
    );

    const roomUrl = response.data.url;
    lesson.roomId = roomUrl;
    await lesson.save();

    res.json({ roomUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create a Daily.co room' });
  }
};
