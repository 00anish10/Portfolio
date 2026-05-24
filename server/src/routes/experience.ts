import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import pool from '../db/pool';
import { AppError } from '../middleware/errorHandler';

const router = Router();

function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
  }
}

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experience ORDER BY "order" ASC, start_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid experience ID'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM experience WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Experience entry not found', 404);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', [
  body('company').notEmpty().withMessage('Company is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('description').notEmpty().withMessage('Description is required'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { company, role, start_date, end_date, description, order } = req.body;
    const result = await pool.query(
      `INSERT INTO experience (company, role, start_date, end_date, description, "order")
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company, role, start_date, end_date || null, description, order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', [
  param('id').isUUID().withMessage('Invalid experience ID'),
  body('company').notEmpty().withMessage('Company is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('description').notEmpty().withMessage('Description is required'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const { company, role, start_date, end_date, description, order } = req.body;
    const result = await pool.query(
      `UPDATE experience SET company = $1, role = $2, start_date = $3, end_date = $4,
       description = $5, "order" = $6 WHERE id = $7 RETURNING *`,
      [company, role, start_date, end_date || null, description, order, id]
    );
    if (result.rows.length === 0) {
      throw new AppError('Experience entry not found', 404);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid experience ID'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const result = await pool.query('DELETE FROM experience WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Experience entry not found', 404);
    }
    res.json({ message: 'Experience entry deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
