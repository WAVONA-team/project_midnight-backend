import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config.js';

import { zodMiddleware } from './middlewares/zod.middleware.js';

import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { musicServicesRouter } from './routes/musicServices.route.js';
import { trackRouter } from './routes/track.route.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use('/users', userRouter);
app.use(musicServicesRouter);
app.use('/track', trackRouter);

app.use(zodMiddleware);

app.listen(PORT, () =>
  console.log(`Server is running on https://localhost:${PORT}`),
);
