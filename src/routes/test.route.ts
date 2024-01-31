import express from 'express';
import * as testController from '../controllers/test.controller.js';

export const router = express.Router();

router.get('/', testController.get);
