import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Protegemos con requireAuth. Solo usuarios auth pueden registrar.
router.post('/scan', requireAuth, AttendanceController.scanQr);

export default router;
