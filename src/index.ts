import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';

import { zodMiddleware } from './middlewares/zod.middleware.js';

import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);
app.use(express.json());

app.use(authRouter);
app.use('/users', userRouter);

app.use(zodMiddleware);

app.listen(PORT, () =>
  console.log(`Server is running on https://localhost:${PORT}`),
);
