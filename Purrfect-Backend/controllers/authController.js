import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import pool from '../config/db.js';
import generateCode from '../utils/generateCode.js';
import sendEmail from '../utils/sendEmail.js';
import { verificationTemplate } from '../services/emailTemplates.js';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = generateCode();

    await pool.query(
      `
      INSERT INTO users
      (name, email, password, verification_code)
      VALUES ($1, $2, $3, $4)
      `,
      [name, email, hashedPassword, code]
    );

    await sendEmail(
      email,
      'Purrfect Verification Code',
      verificationTemplate(name, code)
    );

    res.json({
      message: 'Verification code sent',
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE email=$1
      `,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (user.verification_code !== code) {
      return res.status(400).json({
        message: 'Invalid verification code',
      });
    }

    await pool.query(
      `
      UPDATE users
      SET is_verified=true,
      verification_code=NULL
      WHERE email=$1
      `,
      [email]
    );

    res.json({
      message: 'Email verified',
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE email=$1
      `,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    if (!user.is_verified) {
      return res.status(400).json({
        message: 'Please verify your email first',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, created_at, is_verified
      FROM users
      WHERE id=$1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};