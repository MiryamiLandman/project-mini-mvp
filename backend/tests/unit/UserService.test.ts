import { createUser, getUserByPhone, getUserById, getUserByName, getAllUsers, loginUser } from '../../services/UserService';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with name and phone', async () => {
      const mockUser = {
        _id: '123',
        name: 'David Cohen',
        phone: '0501234567',
        role: 'user',
        save: jest.fn().mockResolvedValue({ _id: '123', name: 'David Cohen', phone: '0501234567', role: 'user' })
      };

      (User as jest.Mock).mockImplementation(() => mockUser);

      const result = await createUser('David Cohen', '0501234567');

      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('name', 'David Cohen');
    });

    it('should throw error if phone already exists', async () => {
      const mockError = new Error('Phone already exists');
      const mockUser = {
        save: jest.fn().mockRejectedValue(mockError)
      };

      (User as jest.Mock).mockImplementation(() => mockUser);

      await expect(createUser('John Doe', '0501234567')).rejects.toThrow();
    });
  });

  describe('getUserByPhone', () => {
    it('should return user by phone number', async () => {
      const mockUser = {
        _id: '123',
        name: 'David Cohen',
        phone: '0501234567',
        role: 'user'
      };

      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserByPhone('0501234567');

      expect(User.findOne).toHaveBeenCalledWith({ phone: '0501234567' });
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserByPhone('9999999999');

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        _id: '123',
        name: 'David Cohen',
        phone: '0501234567',
        role: 'user'
      };

      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserById('123');

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserById('999');

      expect(result).toBeNull();
    });
  });

  describe('getUserByName', () => {
    it('should return user by name', async () => {
      const mockUser = {
        _id: '123',
        name: 'David Cohen',
        phone: '0501234567',
        role: 'user'
      };

      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserByName('David Cohen');

      expect(User.findOne).toHaveBeenCalledWith({ name: 'David Cohen' });
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found by name', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getUserByName('Unknown User');

      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User1', phone: '0501111111', role: 'user' },
        { _id: '2', name: 'User2', phone: '0502222222', role: 'admin' }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockUsers);
      (User.find as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getAllUsers();

      expect(User.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      (User.find as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('loginUser', () => {
    it('should return token and user on successful login', async () => {
      const mockUser = {
        _id: '123',
        name: 'David Cohen',
        phone: '0501234567',
        role: 'user'
      };

      const mockToken = 'jwt-token-123';
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await loginUser('0501234567');

      expect(User.findOne).toHaveBeenCalledWith({ phone: '0501234567' });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123', role: 'user' },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(result).toEqual({ token: mockToken, user: mockUser });
    });

    it('should return null if user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await loginUser('9999999999');

      expect(result).toBeNull();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});