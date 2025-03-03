import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface ITutor extends IUser {
  name: string;
  country: string;
  phone: string;
  videoLink: string;
  description: string;
  languages: { language: string; proficiency: string }[];
  availability: { day: string; start: string; end: string }[];
  pricePerHour: number;
  lessons: Schema.Types.ObjectId[];
}

const TutorSchema = new Schema<ITutor>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  videoLink: { type: String, required: true },
  description: { type: String, required: true },
  languages: [{ language: String, proficiency: String }],
  availability: [{ day: String, start: String, end: String }],
  pricePerHour: { type: Number, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
});

export default model<ITutor>('Tutor', TutorSchema);