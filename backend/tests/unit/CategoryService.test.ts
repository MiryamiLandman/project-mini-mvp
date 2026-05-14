import { getAllCategories, createCategory } from '../../services/CategoryService';
import { Category } from '../../models/Category';

jest.mock('../../models/Category');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { _id: '1', name: 'JavaScript' },
        { _id: '2', name: 'Python' },
        { _id: '3', name: 'React' }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockCategories);
      (Category.find as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getAllCategories();

      expect(Category.find).toHaveBeenCalledWith();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no categories exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      (Category.find as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getAllCategories();

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      const mockExec = jest.fn().mockRejectedValue(mockError);
      (Category.find as jest.Mock).mockReturnValue({ exec: mockExec });

      await expect(getAllCategories()).rejects.toThrow('Database connection failed');
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategory = {
        _id: '123',
        name: 'TypeScript',
        save: jest.fn().mockResolvedValue({
          _id: '123',
          name: 'TypeScript'
        })
      };

      (Category as jest.Mock).mockImplementation(() => mockCategory);

      const result = await createCategory('TypeScript');

      expect(Category).toHaveBeenCalledWith({ name: 'TypeScript' });
      expect(mockCategory.save).toHaveBeenCalled();
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('name', 'TypeScript');
    });

    it('should throw error if category name is empty', async () => {
      const mockCategory = {
        save: jest.fn().mockRejectedValue(new Error('Name is required'))
      };

      (Category as jest.Mock).mockImplementation(() => mockCategory);

      await expect(createCategory('')).rejects.toThrow('Name is required');
    });

    it('should throw error if category already exists', async () => {
      const mockError = new Error('Category already exists');
      const mockCategory = {
        save: jest.fn().mockRejectedValue(mockError)
      };

      (Category as jest.Mock).mockImplementation(() => mockCategory);

      await expect(createCategory('JavaScript')).rejects.toThrow('Category already exists');
    });
  });
});
