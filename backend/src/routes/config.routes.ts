import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint para visualizar todas las configuraciones
router.get('/', ConfigController.getSettings);

// Endpoint para guardar varias configuraciones (requiere sesión iniciada)
router.post('/', requireAuth, ConfigController.updateSettings);

export default router;
