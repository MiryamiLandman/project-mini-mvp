import mongoose from 'mongoose';
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

module.exports = mongoose.model('SubCategory', SubCategorySchema);