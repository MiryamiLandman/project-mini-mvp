import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'חובה להזין שם ומספר טלפון' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: 'השם חייב להכיל לפחות 2 תווים' });
  }

  const phoneRegex = /^[0-9]{9,10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'מספר טלפון לא תקין - יש להזין 9-10 ספרות בלבד' });
  }

  next();
};


export const validatePrompt = (req: Request, res: Response, next: NextFunction) => {
  const { subCategoryId, userPrompt } = req.body;
  if (!subCategoryId || !userPrompt) {
    return res.status(400).json({ message: 'חסרים נתונים: יש לשלוח מזהה תת-קטגוריה ותוכן להנחיה' });
  }

  if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
    return res.status(400).json({ message: 'מזהה תת-קטגוריה אינו תקין' });
  }

  const trimmedPrompt = userPrompt.trim();
  if (trimmedPrompt.length < 2) {
    return res.status(400).json({ message: 'ההנחיה קצרה מדי, אנא פרט יותר כדי לקבל תוצאה איכותית' });
  }

  if (trimmedPrompt.length > 1000) {
    return res.status(400).json({ message: 'ההנחיה ארוכה מדי, נא להגביל לעד 1000 תווים' });
  }

  next();
};


export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    const idToValidate = req.params.id || req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(idToValidate)) {
    return res.status(400).json({ message: 'פורמט מזהה (ID) לא תקין' });
  }

  next();
};