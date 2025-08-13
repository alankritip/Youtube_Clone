/**
 * @description Routes for registering and logging in users with username, email, and password.
 * - Registration requires all three (username, email, password).
 * - Login ALSO requires all three (username, email, password) to match existing record.
 * - Strong password rules enforced at registration and validated in login format.
 * - Field-specific error messages returned for better frontend handling.
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/UserModel.js';

const router = Router();

/* ------------------------------------------------------------------
   POST /api/auth/register
   Register a new user with username, email, and password
   ------------------------------------------------------------------ */
router.post(
  '/register',
  [
    // Username validations
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),

    // Email validations
    body('email')
      .isEmail()
      .withMessage('A valid email is required')
      .normalizeEmail(),

    // Strong password rule:
    // min 8 chars, upper, lower, number, special char
    body('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      .withMessage(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password, avatar } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        errors: [
          {
            field: existingUser.email === email ? 'email' : 'username',
            msg:
              existingUser.email === email
                ? 'Email is already registered'
                : 'Username is already taken',
          },
        ],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  }
);

/* ------------------------------------------------------------------
   POST /api/auth/login
   Login with username, email, and password (all mandatory)
   ------------------------------------------------------------------ */
router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),

    body('email')
      .isEmail()
      .withMessage('A valid email is required')
      .normalizeEmail(),

    // Validate format (strength rules here are only to ensure correct input type, 
    // not to enforce same as registration for security)
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      .withMessage('Password format is invalid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    // Find user by BOTH username & email
    const user = await User.findOne({ username, email }).select('+password');
    if (!user) {
      return res.status(400).json({
        errors: [
          { field: 'username', msg: 'Username and email combination not found' },
          { field: 'email', msg: 'Username and email combination not found' }
        ],
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ field: 'password', msg: 'Incorrect password' }],
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  }
);

export default router;
