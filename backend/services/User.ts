import { User, IUser } from '../models/User';

async function createUser(name: string, phone: string): Promise<IUser> {
  const user = new User({ name, phone });
  return await user.save();
}
async function getUserByPhone(phone: string): Promise<IUser | null> {
  return await User.findOne({ phone }).exec();
}
async function getAllUsers(): Promise<IUser[]> {
  return await User.find().exec();
}
export {createUser, getUserByPhone, getAllUsers};
