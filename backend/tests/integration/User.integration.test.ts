import request from 'supertest';
import mongoose from 'mongoose';
import app from './testApp';
import { User } from '../../models/User';

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (req: any, res: any, next: any) => next(),
  adminOnly: (req: any, res: any, next: any) => next()
}));

jest.mock('../../middleware/validationMiddleware', () => ({
  validateUser: (req: any, res: any, next: any) => next(),
  validateIdParam: (req: any, res: any, next: any) => next(),
  validatePrompt: (req: any, res: any, next: any) => next()
}));

describe('User Integration Tests', () => {
  
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
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ name: 'Miryam', phone: '0501234567' });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Miryam');
      expect(res.body.phone).toBe('0501234567');
      const userInDb = await User.findOne({ phone: '0501234567' });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe('Miryam');
    });

    it('should return 409 if user with the same phone already exists', async () => {
      await User.create({ name: 'Existing User', phone: '0501112222' });
      const res = await request(app)
        .post('/api/users/register')
        .send({ name: 'New Name', phone: '0501112222' });
      expect(res.status).toBe(409);
      expect(res.body.message).toContain('כבר קיים'); 
    });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user successfully', async () => {
      await User.create({ name: 'Login User', phone: '0509998888' });
      const res = await request(app)
        .post('/api/users/login')
        .send({ phone: '0509998888' });
      expect(res.status).toBe(200);
      const returnedPhone = res.body.user ? res.body.user.phone : res.body.phone;
      expect(returnedPhone).toBe('0509998888');
    });

    it('should return 404 if phone is not registered', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ phone: '0500000000' });
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('משתמש לא נמצא');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      await User.create([
        { name: 'User 1', phone: '0501111111' },
        { name: 'User 2', phone: '0502222222' }
      ]);
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const newUser = await User.create({ name: 'Find Me', phone: '0503333333' });
      const res = await request(app).get(`/api/users/${newUser._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Find Me');
    });
  });
});