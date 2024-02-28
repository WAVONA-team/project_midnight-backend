import express from 'express';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.get('/verify/:activationToken', authController.activate);
authRouter.post('/login', authController.login);
authRouter.get('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.post('/reset', authController.reset);
authRouter.get('/reset/:resetToken', authController.resetVerify);
authRouter.patch('/reset/:resetToken', authController.resetActivate);
