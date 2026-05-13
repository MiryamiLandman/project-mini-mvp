import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Category } from './models/Category';
import { SubCategory } from './models/SubCategory';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to MongoDB');

  const existingAdmin = await User.findOne({ phone: '123456789' });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', phone: '123456789', role: 'admin' });
    console.log('✅ Admin created — phone: 123456789');
  } else {
    console.log('ℹ️ Admin already exists');
  }

  const categories = [
    { name: 'מדע', subs: ['חלל', 'פיזיקה', 'כימיה'] },
    { name: 'היסטוריה', subs: ['מלחמת העולם השנייה', 'המהפכה הצרפתית'] },
    { name: 'טכנולוגיה', subs: ['בינה מלאכותית', 'אבטחת מידע', 'פיתוח web'] },
  ];

  for (const cat of categories) {
    let category = await Category.findOne({ name: cat.name });
    if (!category) {
      category = await Category.create({ name: cat.name });
      console.log(`✅ Category created: ${cat.name}`);
    }

    for (const subName of cat.subs) {
      const existingSub = await SubCategory.findOne({ name: subName, category: category._id });
      if (!existingSub) {
        await SubCategory.create({ name: subName, category: category._id });
        console.log(`  ✅ SubCategory created: ${subName}`);
      }
    }
  }

  console.log('🎉 Seed completed!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
