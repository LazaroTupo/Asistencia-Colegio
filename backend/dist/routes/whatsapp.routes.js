"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whatsapp_controller_1 = require("../controllers/whatsapp.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren rol de ADMIN
router.use(auth_middleware_1.requireAdmin);
router.get('/instances', whatsapp_controller_1.WhatsappController.getInstances);
router.post('/instances', whatsapp_controller_1.WhatsappController.createInstance);
router.get('/instances/:instanceName/qr', whatsapp_controller_1.WhatsappController.getQrCode);
router.get('/instances/:instanceName/state', whatsapp_controller_1.WhatsappController.getConnectionState);
router.delete('/instances/:instanceName/logout', whatsapp_controller_1.WhatsappController.logoutInstance);
exports.default = router;
//# sourceMappingURL=whatsapp.routes.js.map