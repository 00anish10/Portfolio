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
      'SELECT * FROM projects ORDER BY "order" ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE featured = true ORDER BY "order" ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid project ID')],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new AppError('Project not found', 404);
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('tech_stack').isArray().withMessage('Tech stack must be an array'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const { title, description, image_url, live_url, repo_url, tech_stack, featured, order } = req.body;
      const result = await pool.query(
        `INSERT INTO projects (title, description, image_url, live_url, repo_url, tech_stack, featured, "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description, image_url || null, live_url || null, repo_url || null, tech_stack, featured || false, order || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid project ID'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('tech_stack').isArray().withMessage('Tech stack must be an array'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const { id } = req.params;
      const { title, description, image_url, live_url, repo_url, tech_stack, featured, order } = req.body;
      const result = await pool.query(
        `UPDATE projects SET title = $1, description = $2, image_url = $3, live_url = $4,
         repo_url = $5, tech_stack = $6, featured = $7, "order" = $8, updated_at = NOW()
         WHERE id = $9 RETURNING *`,
        [title, description, image_url, live_url, repo_url, tech_stack, featured, order, id]
      );
      if (result.rows.length === 0) {
        throw new AppError('Project not found', 404);
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid project ID')],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      validate(req);
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM projects WHERE id = $1 RETURNING id',
        [id]
      );
      if (result.rows.length === 0) {
        throw new AppError('Project not found', 404);
      }
      res.json({ message: 'Project deleted' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
