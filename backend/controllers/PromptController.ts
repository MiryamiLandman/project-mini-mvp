import {Request, Response,NextFunction} from 'express';
import * as prompyService from '../services/PrompyService';
import { AppError } from '../Utils/AppError';

export const generateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, subCategoryId, userPrompt } = req.body;
        if (!userId || !subCategoryId || !userPrompt) {
            return next(new AppError('כל השדות (משתמש, תת-קטגוריה והנחיה) הם חובה', 400));
        }
        const lesson = await prompyService.createAIDrivenLesson(userId, subCategoryId, userPrompt);
        
        res.status(201).json({
            success: true,
            data: lesson
        });
    } catch (err) {
        next(new AppError('שגיאה ביצירת השיעור', 500));
    }
};

export const getAllPromptsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prompts = await prompyService.getAllPromptsAdmin();
        res.status(200).json(prompts);
    } catch (err) {
        next(new AppError('שגיאה בטעינת היסטוריית הלמידה', 500));
    }
};

export const getUserLearningStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const stats = await prompyService.getUserStats(userId);
        res.status(200).json(stats);
    } catch (err) {
        next(new AppError('שגיאה בטעינת סטטיסטיקות הלמידה', 500));
    }
};