import {ISubCategory, SubCategory} from '../models/SubCategory';
import { Category } from '../models/Category';

async function getSubCategoriesByCategoryName(categoryName: string) {
  const category = await Category.findOne({ name: categoryName }).exec();
  if (!category) {
    throw new Error(`קטגוריה בשם "${categoryName}" לא נמצאה`);
  }
  return await SubCategory.find({ category: category._id }).exec();
}
async function createSubCategory(name: string, categoryId: string): Promise<ISubCategory> {
  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists) {
    throw new Error(`קטגוריה עם מזהה זה לא נמצאה`);
  }

  const subCategory = new SubCategory({ name, category: categoryId });
  return await subCategory.save();
}
async function createSubCategoryByCategoryName(name: string, categoryName: string): Promise<ISubCategory> {
  const category = await Category.findOne({ name: categoryName }).exec();
  if (!category) {
    throw new Error(`קטגוריה בשם "${categoryName}" לא נמצאה`);
  }
  const subCategory = new SubCategory({ name, category: category._id });
  return await subCategory.save();
}
async function getSubCategoryById(subCategoryId: string) {
  return await SubCategory.findById(subCategoryId).exec();
}
async function getAllSubCategories() {
  return await SubCategory.find().populate('category').exec();
}


export { getSubCategoriesByCategoryName, createSubCategory, getSubCategoryById, getAllSubCategories, createSubCategoryByCategoryName };
