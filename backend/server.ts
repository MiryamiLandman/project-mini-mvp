import express from 'express';
import 'dotenv/config';
import { connectDB } from './Utils/ConnectDB';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB Successfully');
    console.log(`-----------------------------------------`);
    console.log(`📧 בדיקת הגדרות מייל: ${process.env.EMAIL_USER ? '✅ נטען' : '❌ חסר'}`);
    console.log(`-----------------------------------------`);

    app.listen(PORT, () => {
      console.log(`🚀 השרת פועל בהצלחה בפורט: ${PORT}`);
      console.log(`🔗 Waiting for you at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ שגיאה קריטית בהפעלת השרת:', error);
    process.exit(1);
  }
};

startServer();