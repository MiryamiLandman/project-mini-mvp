import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error Log]: ${err.stack || err.message}`);
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'התרחשה שגיאה פנימית בשרת',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};