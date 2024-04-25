/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import prisma from '../client.js';

import passport from 'passport';
import { Strategy, VerifyCallback, type Profile } from 'passport-spotify';

import { jwtService } from '../services/jwt.service.js';

export const musicServicesRouter = express.Router();

passport.use(
  new Strategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      callbackURL: '',
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      _expires_in: number,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      const { refreshToken: jwtRefreshToken } = req.cookies;
      const jwtUser = jwtService.verifyRefresh(jwtRefreshToken) as JwtPayload;

      await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          spotifyOAUTH: accessToken,
          spotifyRefresh: refreshToken,
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
  async (_req: Request, res: Response) => {
    res.redirect(`${process.env.CLIENT_HOST as string}/tracks`);
  },
);
