import request from 'supertest';
import mongoose from 'mongoose';
import app from './testApp';
import { SubCategory } from '../../models/SubCategory';
import { Category } from '../../models/Category';

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req: any, res: any, next: any) => next(),
  adminOnly: (req: any, res: any, next: any) => next()
}));

jest.mock('../../middleware/validationMiddleware', () => ({
  validateUser: (req: any, res: any, next: any) => next(),
  validateIdParam: (req: any, res: any, next: any) => next(),
  validatePrompt: (req: any, res: any, next: any) => next()
}));

describe('SubCategory Integration Tests', () => {
  let categoryName = 'פיתוח אפליקציות';

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/ai_learning_platform_TEST');
    }
    
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
        await Category.create({ name: categoryName });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  describe('POST /api/subcategories', () => {
    it('should create a new subcategory successfully', async () => {
      const res = await request(app)
        .post('/api/subcategories')
        .send({ 
          name: 'React Native', 
          categoryName: categoryName 
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('React Native');
    });

    it('should return 400 if fields are missing', async () => {
        const res = await request(app)
          .post('/api/subcategories')
          .send({ name: 'Only Name' });
  
        expect(res.status).toBe(400);
      });
  });

  describe('GET /api/subcategories/:categoryName', () => {
    it('should return subcategories for a category name', async () => {
      const cat = await Category.findOne({ name: categoryName });
      await SubCategory.create({ name: 'Flutter', category: cat?._id });

      const res = await request(app).get(`/api/subcategories/${encodeURIComponent(categoryName)}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/subcategories', () => {
    it('should return all subcategories', async () => {
      const res = await request(app).get('/api/subcategories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});