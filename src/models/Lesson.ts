import { Schema, model, Document } from 'mongoose';

export interface ILesson extends Document {
  student: Schema.Types.ObjectId;
  tutor: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  price: number;
  roomId: string; // For virtual classroom
}

const LessonSchema = new Schema<ILesson>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  price: { type: Number, required: true },
  roomId: { type: String }
});

export default model<ILesson>('Lesson', LessonSchema);