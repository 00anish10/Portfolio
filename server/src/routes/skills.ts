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
      'SELECT * FROM skills ORDER BY "order" ASC, name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid skill ID'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Skill not found', 404);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be 0-100'),
  body('category').notEmpty().withMessage('Category is required'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { name, category, proficiency, order } = req.body;
    const result = await pool.query(
      `INSERT INTO skills (name, category, proficiency, "order") VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, category, proficiency, order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', [
  param('id').isUUID().withMessage('Invalid skill ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be 0-100'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const { name, category, proficiency, order } = req.body;
    const result = await pool.query(
      `UPDATE skills SET name = $1, category = $2, proficiency = $3, "order" = $4 WHERE id = $5 RETURNING *`,
      [name, category, proficiency, order, id]
    );
    if (result.rows.length === 0) {
      throw new AppError('Skill not found', 404);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid skill ID'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    validate(req);
    const { id } = req.params;
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      throw new AppError('Skill not found', 404);
    }
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
