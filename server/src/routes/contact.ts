import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db/pool';
import { AppError } from '../middleware/errorHandler';

const router = Router();

function validate(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }
  next();
}

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req, res, next);
      const { name, email, subject, message } = req.body;
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, subject, message]
      );
      res.status(201).json({ message: 'Message sent successfully', id: result.rows[0].id });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
