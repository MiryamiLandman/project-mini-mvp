import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';

async function createUser(name: string, phone: string): Promise<IUser> {
  const user = new User({ name, phone });
  return await user.save();
}
async function getUserByPhone(phone: string): Promise<IUser | null> {
  return await User.findOne({ phone }).exec();
}
async function getUserById(userId: string): Promise<IUser | null> {
  return await User.findById(userId).exec();
}
async function getUserByName(name: string): Promise<IUser | null> {
  return await User.findOne({ name }).exec();
}
async function getAllUsers(): Promise<IUser[]> {
  return await User.find().exec();
}(phone: string): Promise<{ token: string; user: IUser } | null> {
  const user = await User.findOne({ phone }).exec();
  if (!user) return null;
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
  return { token, user };
}

export {createUser, getUserByPhone, getUserById, getUserByName, getAllUsers, loginUser};
