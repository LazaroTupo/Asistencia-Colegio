import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos para que solo directivos/admin consulten si se requiere, de momento auth basta.
router.get('/history', requireAuth, MetricsController.getHistory);
router.get('/summary', requireAuth, MetricsController.getSummary);

export default router;
