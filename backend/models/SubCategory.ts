import mongoose from 'mongoose';
export interface ISubCategory extends mongoose.Document {
  name: string;
  category: mongoose.Types.ObjectId; 
}
const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true
  }
});

export const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);