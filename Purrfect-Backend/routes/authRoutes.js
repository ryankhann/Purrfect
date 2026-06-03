import express from 'express';

import {
  register,
  verify,
  login,
  me,
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
router.post('/login', login);
router.get('/me', authMiddleware, me);

export default router;