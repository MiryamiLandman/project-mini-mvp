import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  role: 'user' | 'admin';
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
});

export const User = mongoose.model<IUser>('User', UserSchema);