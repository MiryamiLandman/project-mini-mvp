import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/CategoryService';
import { AppError } from '../Utils/AppError';
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
return next(new AppError('שגיאה בטעינת הקטגוריות', 500));}
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        if (!name) {
            const error: any = new Error('שם הקטגוריה הוא שדה חובה');
            error.statusCode = 400;
            return next(new AppError('שם הקטגוריה הוא שדה חובה', 400));
        }
        const newCategory = await categoryService.createCategory(name);
        res.status(201).json(newCategory);
    } catch (err) {
        return next(new AppError('שגיאה ביצירת הקטגוריה', 500));
    }
    };
