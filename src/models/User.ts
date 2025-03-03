import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'student' | 'tutor' | 'admin';
  isActive: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], required: true },
  isActive: { type: Boolean, default: true }
});

export default model<IUser>('User', UserSchema);