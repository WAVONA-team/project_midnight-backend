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
  resetSchema,
  setPasswordSchema,
  verifyResetTokenSchema,
  deleteSchema,
} from '../zodSchemas/auth/index.js';

import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { musicServicesService } from '../services/musicServices.service.js';

const register = async (req: Request, res: Response) => {
  authSchema.parse(req.body);

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await authService.register(
    email.toLowerCase(),
    hashedPassword,
  );

  res.send(createdUser);
};

const activate = async (req: Request, res: Response) => {
  activateSchema.parse(req.params);

  const { activationToken } = req.params;
  const user = await authService.activate(activationToken);

  await generateTokens(res, user);
};

const login = async (req: Request, res: Response) => {
  authSchema.parse(req.body);

  const { email, password } = req.body;
  const user = await userService.findByEmail(email.toLowerCase());

  userLoginSchema.parse(user || {});

  await loginSchema.parseAsync({
    email: email.toLowerCase(),
    confirmPassword: password,
    password: user!.password,
  });

  await generateTokens(res, user as User);
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const jwtUser = jwtService.verifyRefresh(refreshToken) as JwtPayload;
  const token = await tokenService.getByToken(refreshToken);

  const user = await userService.getById(jwtUser.id);

  refreshSchema.parse({
    userId: user?.id,
    token: token?.refreshToken,
  });

  if (user?.spotifyRefresh) {
    await musicServicesService.spotifyRefresh(user.spotifyRefresh, user.id);
  }

  await generateTokens(res, user as User);
};

const generateTokens = async (res: Response, user: User) => {
  const normalizedUser = userService.normalize(user);

  const accessToken = jwtService.sign(normalizedUser);
  const refreshAccessToken = jwtService.signRefresh(normalizedUser);

  await tokenService.save(normalizedUser.id, refreshAccessToken);

  res.cookie('refreshToken', refreshAccessToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/; samesite=None; Partitioned',
    // domain: 'project-midnight.com',
  });

  res.send({
    user: normalizedUser,
    accessToken,
  });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const user = jwtService.verifyRefresh(refreshToken) as JwtPayload;

  refreshSchema.parse({
    userId: user.id,
    token: refreshToken,
  });

  await tokenService.remove(user.id);

  res.sendStatus(204);
};

const reset = async (req: Request, res: Response) => {
  resetSchema.parse(req.body);

  const { email } = req.body;

  res.send(await authService.reset(email));
};

const resetVerify = async (req: Request, res: Response) => {
  verifyResetTokenSchema.parse(req.params);

  const { resetToken } = req.params;

  return res.send(await authService.resetVerify(resetToken));
};

const resetActivate = async (req: Request, res: Response) => {
  setPasswordSchema.parse({
    ...req.body,
    ...req.params,
  });

  const { resetToken } = req.params;
  const { newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  res.send(await authService.resetActivate(resetToken, hashedPassword));
};

const deleteUser = async (req: Request, res: Response) => {
  deleteSchema.parse(req.params);

  const { email } = req.params;

  await authService.deleteUser(email);

  res.send(200);
};

const resend = async (req: Request, res: Response) => {
  deleteSchema.parse(req.params);

  const { email } = req.params;

  res.send(await authService.resend(email));
};

const deleteResetToken = async (req: Request, res: Response) => {
  deleteSchema.parse(req.params);

  const { email } = req.params;

  res.send(await authService.deleteResetToken(email));
};

const resendResetToken = async (req: Request, res: Response) => {
  deleteSchema.parse(req.params);

  const { email } = req.params;

  res.send(await authService.resendResetToken(email));
};

export const authController = {
  register,
  activate,
  login,
  refresh,
  logout,
  reset,
  resetVerify,
  resetActivate,
  deleteUser,
  resend,
  deleteResetToken,
  resendResetToken,
};
