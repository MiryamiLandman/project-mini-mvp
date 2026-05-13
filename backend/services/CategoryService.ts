import {ICategory, Category} from '../models/Category';
async function getAllCategories(){
 return await  Category.find().exec();
}

async function createCategory(name: string): Promise<ICategory> {
  const category = new Category({ name });
  return await category.save();
}
export {getAllCategories, createCategory};