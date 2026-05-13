import express from 'express';
import 'dotenv/config';
import { connectDB } from './Utils/ConnectDB';
import { errorHandler } from './middleware/errorHandling';
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB Successfully');
    app.listen(PORT, () => {
      console.log(`🚀 השרת פועל בהצלחה בפורט: ${PORT}`);
      console.log(`🔗 Waiting for you at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ שגיאה קריטית בהפעלת השרת:', error);
    process.exit(1);
  }
};

app.use(errorHandler);

startServer();