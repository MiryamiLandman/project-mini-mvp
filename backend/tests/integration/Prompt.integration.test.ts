import request from 'supertest';
import mongoose from 'mongoose';
import app from './testApp';
import { Prompt } from '../../models/Prompt';
import { User } from '../../models/User';
import { Category } from '../../models/Category';
import { SubCategory } from '../../models/SubCategory';

const testUserObjectId = new mongoose.Types.ObjectId();

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'זוהי תשובת דמה מהמורה הדיגיטלי' } }],
          }),
        },
      },
    })),
  };
});

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req: any, res: any, next: any) => {
    req.user = { id: testUserObjectId.toHexString() };
    next();
  },
  adminOnly: (req: any, res: any, next: any) => next()
}));

jest.mock('../../middleware/validationMiddleware', () => ({
  validatePrompt: (req: any, res: any, next: any) => next(),
  validateIdParam: (req: any, res: any, next: any) => next(),
  validateUser: (req: any, res: any, next: any) => next()
}));

describe('Prompt Integration Tests', () => {
  let userId: string;
  let categoryId: string;
  let subCategoryId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/ai_learning_platform_TEST');
    }
    
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      Prompt.deleteMany({})
    ]);

    const user = await User.create({ 
      _id: testUserObjectId, 
      name: 'Test Student', 
      phone: '054' + Math.random() 
    });
    userId = user._id.toString();

    const category = await Category.create({ name: 'תכנות' });
    categoryId = category._id.toString();

    const subCategory = await SubCategory.create({ 
      name: 'Node.js', 
      category: new mongoose.Types.ObjectId(categoryId)
    });
    subCategoryId = subCategory._id.toString();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await Prompt.deleteMany({});
  });

  describe('POST /api/prompts/generate', () => {
    it('should create an AI driven lesson successfully', async () => {
      const res = await request(app)
        .post('/api/prompts/generate')
        .send({
          subCategoryId: subCategoryId,
          userPrompt: 'מה זה Event Loop?'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.prompt).toBe('מה זה Event Loop?');
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/prompts/generate')
        .send({ userPrompt: 'בלי קטגוריה' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/prompts/my-prompts', () => {
    it('should return all prompts for the logged in user', async () => {
      await Prompt.create({
        user_id: testUserObjectId,
        category_id: new mongoose.Types.ObjectId(categoryId),
        sub_category_id: new mongoose.Types.ObjectId(subCategoryId),
        prompt: 'שאלה 1',
        response: 'תשובה 1'
      });

      const res = await request(app).get('/api/prompts/my-prompts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/prompts/stats/:userId', () => {
    it('should return learning statistics for a user', async () => {
      await Prompt.create({
        user_id: testUserObjectId,
        category_id: new mongoose.Types.ObjectId(categoryId),
        sub_category_id: new mongoose.Types.ObjectId(subCategoryId),
        prompt: 'שאלה לסטטיסטיקה',
        response: 'תשובה'
      });

      const res = await request(app).get(`/api/prompts/stats/${userId}`);

      expect(res.status).toBe(200);
      expect(res.body.totalLessons).toBeGreaterThanOrEqual(1);
      expect(res.body.favoriteCategory).toBe('תכנות');
    });
  });
});