import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren rol de ADMIN
router.use(requireAdmin);

router.get('/', StudentController.getAll);
router.post('/', StudentController.create);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.delete);

export default router;
