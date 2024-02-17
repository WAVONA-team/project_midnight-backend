import { type Request, type Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';

import {
  authSchema,
  activateSchema,
  loginSchema,
  userLoginSchema,
} from '../zodSchemas/auth/index.js';

import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { authService } from '../services/auth.service.js';

const register = async (req: Request, res: Response) => {
  authSchema.parse(req.body);

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await authService.register(email, hashedPassword);

  res.send(createdUser);
};

const activate = async (req: Request, res: Response) => {
  activateSchema.parse(req.params);

  const { activationToken } = req.params;

  res.send(await authService.activate(activationToken));
};

const login = async (req: Request, res: Response) => {
  authSchema.parse(req.body);

  const { email, password } = req.body;
  const user = await userService.findByEmail(email);

  userLoginSchema.parse(user || {});

  await loginSchema.parseAsync({
    email,
    confirmPassword: password,
    password: user!.password,
  });

  const normalizedUser = userService.normalize(user!);
  const accessToken = jwtService.sign(normalizedUser);

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

export const authController = {
  register,
  activate,
  login,
};
