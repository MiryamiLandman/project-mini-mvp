import express from 'express';
import categoryRoutes from '../../routes/CategoryRoute';
import userRoutes from '../../routes/UserRoute';
import promptRoutes from '../../routes/PrompyRoute';
import SubCategoryRoutes from '../../routes/SubCategoryRoute';
import { errorHandler } from '../../middleware/errorHandling';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/prompts', promptRoutes); 
app.use('/api/subcategories', SubCategoryRoutes); 
app.use(errorHandler);
export default app;