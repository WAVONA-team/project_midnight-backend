import jwt from 'jsonwebtoken';
import { NormalizedUser } from 'project_midnight';

const sign = (user: NormalizedUser) => {
  const token = jwt.sign(user.id, process.env.JWT_KEY as string);

  return token;
};

const verify = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY as string);
  } catch {
    return null;
  }
};

const signRefresh = (user: NormalizedUser) => {
  const token = jwt.sign(user.id, process.env.JWT_REFRESH_KEY as string);

  return token;
};

const verifyRefresh = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY as string);
  } catch {
    return null;
  }
};

export const jwtService = {
  sign,
  verify,
  signRefresh,
  verifyRefresh,
};
