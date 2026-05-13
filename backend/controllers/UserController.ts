import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/UserService';
import { AppError } from '../Utils/AppError';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone } = req.body;
        const existingUser = await userService.getUserByPhone(phone);
        if (existingUser) {
            return next(new AppError('משתמש עם מספר טלפון זה כבר קיים במערכת', 409));
        }
        const newUser = await userService.createUser(name, phone);
        res.status(201).json(newUser);

    } catch (err) {
        return next(new AppError('משתמש כבר קיים', 409));
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
            return next(new AppError('משתמש לא נמצא', 404));
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
export const getUserByName = async (req: Request, res: Response, next: NextFunction) => {
    try {const { name } = req.params;
        const user = await userService.getUserByName(name);
        if(!user) {
            return next(new AppError('משתמש לא נמצא', 404));
        }   
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
export const getUserByPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {const { phone } = req.params;
        const user = await userService.getUserByPhone(phone);
        if(!user) {
            return next(new AppError('משתמש לא נמצא', 404));
        }   
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
