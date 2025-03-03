import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default model<IStudent>('Student', StudentSchema);