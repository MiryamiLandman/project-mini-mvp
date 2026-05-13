import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/ConnectDB';
import { errorHandler } from './middleware/errorHandling';
import categoryRoutes from './routes/CategoryRoute';
import subCategoryRoutes from './routes/SubCategoryRoute';
import userRoutes from './routes/UserRoute';
import promptRoutes from './routes/PrompyRoute';

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/prompts', promptRoutes);
app.use(errorHandler);

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

startServer();