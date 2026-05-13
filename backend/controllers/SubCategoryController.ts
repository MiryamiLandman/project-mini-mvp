import { Request, Response, NextFunction } from 'express';
import * as subCategoryService from '../services/SubCategoryService';
import { AppError } from '../Utils/AppError';
export const getSubCategoriesByCatName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryName } = req.params;
        const subCategories = await subCategoryService.getSubCategoriesByCategoryName(categoryName);
        res.status(200).json(subCategories);
    } catch (err) {
        return next(new AppError('שגיאה בטעינת תתי הקטגוריות', 500));
    }
};

export const createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, categoryName } = req.body;
        if (!name || !categoryName) {
            return next(new AppError('שם תת-הקטגוריה ושם הקטגוריה הם שדות חובה', 400));
        }

        const newSubCategory = await subCategoryService.createSubCategoryByCategoryName(name, categoryName);
        res.status(201).json(newSubCategory);
    } catch (err) {
        return next(new AppError('שגיאה ביצירת תת-הקטגוריה', 500));
    }
};

export const getAllSubCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allSubCategories = await subCategoryService.getAllSubCategories();
        res.status(200).json(allSubCategories);
    } catch (err) {
        return next(new AppError('שגיאה בטעינת תתי הקטגוריות', 500));
    }
};