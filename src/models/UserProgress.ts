import { Schema, model, Document } from 'mongoose';

export interface IUserProgress extends Document {
  user: Schema.Types.ObjectId;
  exercise: Schema.Types.ObjectId;
  score: number;
  completedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

export default model<IUserProgress>('UserProgress', UserProgressSchema);