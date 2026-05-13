import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'לא מורשה, הטוקן נכשל' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'לא מורשה, אין טוקן' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'גישה נדחתה: נדרשות הרשאות מנהל' });
  }
};