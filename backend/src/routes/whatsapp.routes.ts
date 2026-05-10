import { Router } from 'express';
import { WhatsappController } from '../controllers/whatsapp.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren rol de ADMIN
router.use(requireAdmin);

router.get('/instances', WhatsappController.getInstances);
router.post('/instances', WhatsappController.createInstance);
router.get('/instances/:instanceName/qr', WhatsappController.getQrCode);
router.get('/instances/:instanceName/state', WhatsappController.getConnectionState);
router.delete('/instances/:instanceName/logout', WhatsappController.logoutInstance);

export default router;
