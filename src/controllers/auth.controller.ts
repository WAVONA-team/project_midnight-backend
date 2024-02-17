import { type Request, type Response } from 'express';
import 'express-async-errors';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

import { User } from 'project_midnight';

import {
  authSchema,
  activateSchema,
  loginSchema,
  userLoginSchema,
  refreshSchema,
} from '../zodSchemas/auth/index.js';

import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';

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

  await generateTokens(res, user as User);
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const user = jwtService.verifyRefresh(refreshToken);
  const token = await tokenService.getByToken(refreshToken);

  refreshSchema.parse(user ? { ...(user as JwtPayload), token } : {});

  generateTokens(res, user as User);
};

const generateTokens = async (res: Response, user: User) => {
  const normalizedUser = userService.normalize(user!);

  const accessToken = jwtService.sign(normalizedUser);
  const refreshAccessToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshAccessToken);

  res.cookie('refreshToken', refreshAccessToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const user = jwtService.verifyRefresh(refreshToken) as JwtPayload;

  refreshSchema.parse(user ? { ...(user as JwtPayload), refreshToken } : {});

  await tokenService.remove(user.id);

  res.sendStatus(204);
};

export const authController = {
  register,
  activate,
  login,
  refresh,
  logout,
};
