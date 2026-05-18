import { Router } from 'express';
import authRoutes from './auth.routes';
import configRoutes from './config.routes';
import attendanceRoutes from './attendance.routes';
import metricsRoutes from './metrics.routes';
import whatsappRoutes from './whatsapp.routes';
import studentRoutes from './student.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/config', configRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/metrics', metricsRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/students', studentRoutes);

export default router;
