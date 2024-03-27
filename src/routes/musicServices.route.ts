/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { User } from 'project_midnight';
import prisma from '../client.js';

import passport from 'passport';
import { Strategy, VerifyCallback, type Profile } from 'passport-spotify';

import { jwtService } from '../services/jwt.service.js';
import { userService } from '../services/user.service.js';
import { tokenService } from '../services/token.service.js';

export const musicServicesRouter = express.Router();

passport.use(
  new Strategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:8080/auth/spotify/callback',
      passReqToCallback: true,
    },
    async (
      req: Request,
      _accessToken: string,
      _refreshToken: string,
      _expires_in: number,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const { refreshToken } = req.cookies;
      const jwtUser = jwtService.verifyRefresh(refreshToken) as JwtPayload;

      await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          spotifyOAUTH: profile.id,
        },
      });

      return done(null, profile);
    },
  ),
);

musicServicesRouter.get('/auth/spotify', passport.authenticate('spotify'));

musicServicesRouter.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify'),
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const token = await tokenService.getByToken(refreshToken);
    const user = await userService.findById(token?.userId as string);

    res.redirect(`${process.env.CLIENT_HOST as string}/tracks`);
    // res.send(userService.normalize(user as User));
  },
);
