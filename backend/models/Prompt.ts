import mongoose, { Schema } from 'mongoose';

const PromptSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  category_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  }, 
  sub_category_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true 
  }, 
  prompt: { 
    type: String, 
    required: true 
  }, 
  response: { 
    type: String, 
    required: true 
  }  
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: false } 
});

export default mongoose.model('Prompt', PromptSchema);