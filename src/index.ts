import express from 'express';
import cors from 'cors';

import { router as testRouter } from './routes/test.route.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.use('/test', express.json(), testRouter);

app.listen(PORT, () =>
  console.log(`Server is running on https://localhost:${PORT}`),
);
