import mongoose from 'mongoose';

const mockCreate = jest.fn();

jest.mock('openai', () => {
  return {
    OpenAI: class {
      constructor() {
        this.chat = {
          completions: {
            create: mockCreate
          }
        };
      }
    }
  };
});

import { 
  createAIDrivenLesson, 
  getPromptById, 
  getAllPromptsAdmin,
  deletePrompt,
  getUserStats,
  getUserPrompts
} from '../../services/PrompyService';
import { Prompt } from '../../models/Prompt';
import { SubCategory } from '../../models/SubCategory';

jest.mock('../../models/Prompt');
jest.mock('../../models/SubCategory');

describe('PrompyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockClear();
  });

  describe('createAIDrivenLesson', () => {
    it('should create an AI-driven lesson successfully', async () => {
      const mockSubCategory = {
        _id: '456',
        name: 'ES6 Basics',
        category: { _id: '123', name: 'JavaScript' }
      };

      const mockPrompt = {
        _id: '789',
        user_id: '111',
        category_id: '123',
        sub_category_id: '456',
        prompt: 'What is arrow function?',
        response: 'An arrow function is a concise way to write functions in JavaScript...',
        save: jest.fn().mockResolvedValue({
          _id: '789',
          user_id: '111',
          category_id: '123',
          sub_category_id: '456',
          prompt: 'What is arrow function?',
          response: 'An arrow function is a concise way to write functions in JavaScript...'
        })
      };

      const mockExecSubCategory = jest.fn().mockResolvedValue(mockSubCategory);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExecSubCategory });
      (SubCategory.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const mockOpenAIResponse = {
        choices: [
          {
            message: {
              content: 'An arrow function is a concise way to write functions in JavaScript...'
            }
          }
        ]
      };

      mockCreate.mockResolvedValue(mockOpenAIResponse);
      (Prompt as jest.Mock).mockImplementation(() => mockPrompt);

      const result = await createAIDrivenLesson('111', '456', 'What is arrow function?');

      expect(SubCategory.findById).toHaveBeenCalledWith('456');
      expect(mockPrompt.save).toHaveBeenCalled();
      expect(result).toHaveProperty('_id', '789');
    });

    it('should throw error if subcategory not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (SubCategory.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      await expect(createAIDrivenLesson('111', '999', 'What is a function?')).rejects.toThrow(
        'תת-קטגוריה לא נמצאה'
      );
    });

    it('should handle OpenAI API errors', async () => {
      const mockSubCategory = {
        _id: '456',
        name: 'ES6 Basics',
        category: { _id: '123', name: 'JavaScript' }
      };

      const mockExec = jest.fn().mockResolvedValue(mockSubCategory);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (SubCategory.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      mockCreate.mockRejectedValue(new Error('API Error'));

      await expect(createAIDrivenLesson('111', '456', 'Test')).rejects.toThrow(
        'נכשלה יצירת השיעור'
      );
    });
  });

  describe('getPromptById', () => {
    it('should return prompt by id with populated data', async () => {
      const mockPrompt = {
        _id: '789',
        user_id: '111',
        category_id: { _id: '123', name: 'JavaScript' },
        sub_category_id: { _id: '456', name: 'ES6' },
        prompt: 'What is arrow function?',
        response: 'An arrow function is...'
      };

      const mockExec = jest.fn().mockResolvedValue(mockPrompt);
      const mockPopulate2 = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Prompt.findById as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      const result = await getPromptById('789');

      expect(Prompt.findById).toHaveBeenCalledWith('789');
      expect(result).toEqual(mockPrompt);
    });

    it('should return null if prompt not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockPopulate2 = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Prompt.findById as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      const result = await getPromptById('999');

      expect(result).toBeNull();
    });
  });

  describe('getAllPromptsAdmin', () => {
    it('should return all prompts with populated user, category, and subcategory data', async () => {
      const mockPrompts = [
        {
          _id: '1',
          user_id: { name: 'User1', phone: '0501111111' },
          category_id: { name: 'JavaScript' },
          sub_category_id: { name: 'ES6' },
          prompt: 'Question 1',
          response: 'Answer 1',
          created_at: new Date()
        }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockPrompts);
      const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulate3 = jest.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate2 = jest.fn().mockReturnValue({ populate: mockPopulate3 });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Prompt.find as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      const result = await getAllPromptsAdmin();

      expect(Prompt.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockPrompts);
    });
  });

  describe('deletePrompt', () => {
    it('should delete prompt if user owns it', async () => {
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 1 });
      (Prompt.deleteOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await deletePrompt('789', '111');

      expect(Prompt.deleteOne).toHaveBeenCalledWith({ _id: '789', user_id: '111' });
      expect(result).toBe(true);
    });

    it('should return false if prompt not found or user does not own it', async () => {
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 0 });
      (Prompt.deleteOne as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await deletePrompt('999', '111');

      expect(result).toBe(false);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics with favorite category', async () => {
      const validObjectId = new mongoose.Types.ObjectId();
      
      const mockStats = [
        {
          totalCount: [{ count: 5 }],
          byCategory: [
            { name: 'JavaScript', count: 3 },
            { name: 'Python', count: 2 }
          ]
        }
      ];

      (Prompt.aggregate as jest.Mock).mockResolvedValue(mockStats);

      const result = await getUserStats(validObjectId.toHexString());

      expect(result).toHaveProperty('totalLessons', 5);
      expect(result).toHaveProperty('favoriteCategory', 'JavaScript');
      expect(result).toHaveProperty('categoryBreakdown');
    });

    it('should return default stats when user has no prompts', async () => {
      const validObjectId = new mongoose.Types.ObjectId();
      
      const mockStats = [
        {
          totalCount: [],
          byCategory: []
        }
      ];

      (Prompt.aggregate as jest.Mock).mockResolvedValue(mockStats);

      const result = await getUserStats(validObjectId.toHexString());

      expect(result).toHaveProperty('totalLessons', 0);
      expect(result).toHaveProperty('favoriteCategory', 'טרם נלמד');
    });
  });

  describe('getUserPrompts', () => {
    it('should return all user prompts sorted by date', async () => {
      const mockPrompts = [
        {
          _id: '1',
          user_id: '111',
          category_id: { name: 'JavaScript' },
          sub_category_id: { name: 'ES6' },
          prompt: 'Question 1',
          response: 'Answer 1',
          created_at: new Date()
        }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockPrompts);
      const mockSort = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      (Prompt.find as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

      const result = await getUserPrompts('111');

      expect(Prompt.find).toHaveBeenCalledWith({ user_id: '111' });
      expect(result).toEqual(mockPrompts);
    });
  });
});
