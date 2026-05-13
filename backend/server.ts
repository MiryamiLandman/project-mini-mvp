import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './Utils/ConnectDB';
import { errorHandler } from './middleware/errorHandling';
import categoryRoutes from './routes/CategoryRoute';
import subCategoryRoutes from './routes/SubCategoryRoute';
import userRoutes from './routes/UserRoute';
import promptRoutes from './routes/PrompyRoute';

const app = express();

// Middlewares
app.use(cors()); // מאפשר ל-Frontend לגשת לשרת
app.use(express.json());

// Routes
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