import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/index.js';

export const userRouter = express.Router();

userRouter.get('/', authMiddleware, userController.getAll);
userRouter.patch('/remove-app', authMiddleware, userController.removeApp);
