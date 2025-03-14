import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  status: 'pending' | 'approved' | 'rejected'
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], required: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true },
});

export default model<IUser>('User', UserSchema);