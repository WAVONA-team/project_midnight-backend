/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';

import passport from 'passport';
import { Strategy, VerifyCallback, type Profile } from 'passport-spotify';

import prisma from '../client.js';
import { jwtService } from '../services/jwt.service.js';

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
      const user = jwtService.verifyRefresh(refreshToken) as JwtPayload;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          spotifyOAUTH: profile.id,
        },
      });

      return done(null, profile);
    },
  ),
);

musicServicesRouter.get(
  '/auth/spotify',
  passport.authenticate('spotify'),
);

musicServicesRouter.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify'),
  (_req: Request, res: Response) =>
    res.redirect(process.env.CLIENT_HOST as string),
);
