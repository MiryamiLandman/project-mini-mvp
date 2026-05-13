
import { Request, Response, NextFunction } from 'express';
import logger from '../Utils/logger'; 

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, { stack: err.stack });
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'התרחשה שגיאה פנימית בשרת',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};