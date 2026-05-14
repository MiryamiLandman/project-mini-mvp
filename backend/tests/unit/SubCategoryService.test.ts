import { 
  getSubCategoriesByCategoryName, 
  createSubCategory, 
  getSubCategoryById,
  getAllSubCategories,
  createSubCategoryByCategoryName
} from '../../services/SubCategoryService';
import { SubCategory } from '../../models/SubCategory';
import { Category } from '../../models/Category';

jest.mock('../../models/SubCategory');
jest.mock('../../models/Category');

describe('SubCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubCategoriesByCategoryName', () => {
    it('should return subcategories for a given category name', async () => {
      const mockCategory = { _id: '123', name: 'JavaScript' };
      const mockSubCategories = [
        { _id: '1', name: 'ES6', category: '123' },
        { _id: '2', name: 'Async/Await', category: '123' }
      ];

      const mockExecCategory = jest.fn().mockResolvedValue(mockCategory);
      (Category.findOne as jest.Mock).mockReturnValue({ exec: mockExecCategory });

      const mockExecSubCategory = jest.fn().mockResolvedValue(mockSubCategories);
      (SubCategory.find as jest.Mock).mockReturnValue({ exec: mockExecSubCategory });

      const result = await getSubCategoriesByCategoryName('JavaScript');

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'JavaScript' });
      expect(SubCategory.find).toHaveBeenCalledWith({ category: '123' });
      expect(result).toEqual(mockSubCategories);
    });

    it('should throw error if category not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (Category.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      await expect(getSubCategoriesByCategoryName('NonExistent')).rejects.toThrow(
        'קטגוריה בשם "NonExistent" לא נמצאה'
      );
    });
  });

  describe('createSubCategory', () => {
    it('should create a new subcategory', async () => {
      const mockSubCategory = {
        _id: '456',
        name: 'ES6 Basics',
        category: '123',
        save: jest.fn().mockResolvedValue({
          _id: '456',
          name: 'ES6 Basics',
          category: '123'
        })
      };

      (Category.exists as jest.Mock).mockResolvedValue(true);
      (SubCategory as jest.Mock).mockImplementation(() => mockSubCategory);

      const result = await createSubCategory('ES6 Basics', '123');

      expect(Category.exists).toHaveBeenCalledWith({ _id: '123' });
      expect(SubCategory).toHaveBeenCalledWith({ name: 'ES6 Basics', category: '123' });
      expect(mockSubCategory.save).toHaveBeenCalled();
      expect(result).toHaveProperty('name', 'ES6 Basics');
    });

    it('should throw error if category does not exist', async () => {
      (Category.exists as jest.Mock).mockResolvedValue(false);

      await expect(createSubCategory('ES6 Basics', '999')).rejects.toThrow(
        'קטגוריה עם מזהה זה לא נמצאה'
      );
    });
  });

  describe('createSubCategoryByCategoryName', () => {
    it('should create subcategory by category name', async () => {
      const mockCategory = { _id: '123', name: 'JavaScript' };
      const mockSubCategory = {
        _id: '456',
        name: 'Promises',
        category: '123',
        save: jest.fn().mockResolvedValue({
          _id: '456',
          name: 'Promises',
          category: '123'
        })
      };

      const mockExecCategory = jest.fn().mockResolvedValue(mockCategory);
      (Category.findOne as jest.Mock).mockReturnValue({ exec: mockExecCategory });
      (SubCategory as jest.Mock).mockImplementation(() => mockSubCategory);

      const result = await createSubCategoryByCategoryName('Promises', 'JavaScript');

      expect(Category.findOne).toHaveBeenCalledWith({ name: 'JavaScript' });
      expect(mockSubCategory.save).toHaveBeenCalled();
      expect(result).toHaveProperty('name', 'Promises');
    });

    it('should throw error if category name not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (Category.findOne as jest.Mock).mockReturnValue({ exec: mockExec });

      await expect(createSubCategoryByCategoryName('Promises', 'NonExistent')).rejects.toThrow(
        'קטגוריה בשם "NonExistent" לא נמצאה'
      );
    });
  });

  describe('getSubCategoryById', () => {
    it('should return subcategory by id', async () => {
      const mockSubCategory = { _id: '456', name: 'ES6 Basics', category: '123' };

      const mockExec = jest.fn().mockResolvedValue(mockSubCategory);
      (SubCategory.findById as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getSubCategoryById('456');

      expect(SubCategory.findById).toHaveBeenCalledWith('456');
      expect(result).toEqual(mockSubCategory);
    });

    it('should return null if subcategory not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (SubCategory.findById as jest.Mock).mockReturnValue({ exec: mockExec });

      const result = await getSubCategoryById('999');

      expect(result).toBeNull();
    });
  });

  describe('getAllSubCategories', () => {
    it('should return all subcategories with populated category data', async () => {
      const mockSubCategories = [
        { _id: '1', name: 'ES6', category: { _id: '123', name: 'JavaScript' } },
        { _id: '2', name: 'React Hooks', category: { _id: '124', name: 'React' } }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockSubCategories);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (SubCategory.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      const result = await getAllSubCategories();

      expect(SubCategory.find).toHaveBeenCalledWith();
      expect(mockPopulate).toHaveBeenCalledWith('category');
      expect(result).toEqual(mockSubCategories);
    });
  });
});
