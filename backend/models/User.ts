import mongoose from 'mongoose';
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
  }
});

module.exports = mongoose.model('User', UserSchema);