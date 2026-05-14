import request from 'supertest';
import mongoose from 'mongoose';
import app from './testApp';
import { Category } from '../../models/Category';

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req: any, res: any, next: any) => next(),
  adminOnly: (req: any, res: any, next: any) => next()
}));

describe('Category Integration Tests', () => {

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      const testDbUri = 'mongodb://localhost:27017/ai_learning_platform_TEST';
      await mongoose.connect(testDbUri);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Category.deleteMany({});
    }
  });

  describe('POST /api/categories', () => {
    it('should create a new category successfully', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'JavaScript Development' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('JavaScript Development');
      expect(res.body._id).toBeDefined();

      const categoryInDb = await Category.findOne({ name: 'JavaScript Development' });
      expect(categoryInDb).not.toBeNull();
      expect(categoryInDb?.name).toBe('JavaScript Development');
    });

    it('should return 400 if category name is missing', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('שם הקטגוריה הוא שדה חובה');
    });
  });

  describe('GET /api/categories', () => {
    it('should return a list of all categories', async () => {
      await Category.create([{ name: 'React' }, { name: 'Node.js' }]);

      const res = await request(app).get('/api/categories');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe('React');
    });

    it('should return an empty array if no categories exist', async () => {
      const res = await request(app).get('/api/categories');
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});