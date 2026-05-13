import mongoose from 'mongoose';

export interface ICategory extends Document {
  name: string;
}
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);