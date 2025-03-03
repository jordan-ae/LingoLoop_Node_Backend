import { Schema, model, Document } from 'mongoose';

export interface IExercise extends Document {
  type: 'vocabulary' | 'grammar' | 'pronunciation' | 'spelling';
  question: string;
  answer: string;
}

const ExerciseSchema = new Schema<IExercise>({
  type: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

export default model<IExercise>('Exercise', ExerciseSchema);