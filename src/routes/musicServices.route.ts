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
      callbackURL: `${process.env.SERVER_HOST as string}/auth/spotify/callback`,
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
      const { refreshToken: jwtToken } = req.cookies;
      const user = jwtService.verifyRefresh(jwtToken) as JwtPayload;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          spotifyOAUTH: accessToken,
          spotifyRefresh: refreshToken,
        },
      });

      return done(null, {
        ...profile,
        spotifyOAUTH: accessToken,
        spotifyRefresh: refreshToken,
      });
    },
  ),
);

musicServicesRouter.get(
  '/auth/spotify',
  passport.authenticate('spotify', { session: false }),
);

musicServicesRouter.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { session: false }),
  async (_req: Request, res: Response) => {
    res.redirect(`${process.env.CLIENT_HOST as string}/tracks`);
  },
);
