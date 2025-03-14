import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface ITutor extends Document {
  user: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  country: string;
  phone: string;
  videoLink: string;
  bio: string;
  languages: { language: string; proficiency: string }[];
  certificationExams: string[];
  availability?: { day: string; start: string; end: string }[];
  pricePerHour?: number;
  lessons?: Schema.Types.ObjectId[];
  document?: string;
  teachingLanguage?: string
  catchPhrase?: string
}

const TutorSchema = new Schema<ITutor>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String },
  phone: { type: String },
  videoLink: { type: String },
  bio: { type: String },
  languages: [{ language: String, proficiency: String }],
  certificationExams: [String],
  availability: [{ day: String, start: String, end: String }],
  pricePerHour: { type: Number },
  document: { type: String },
  status: {type: String, enum: ['pending', 'approved', 'rejected'], required: true},
  teachingLanguage: {type: String},
  catchPhrase: {type: String}
});

export default model<ITutor>('Tutor', TutorSchema);