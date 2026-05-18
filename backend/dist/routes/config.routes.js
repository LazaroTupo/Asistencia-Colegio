"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_controller_1 = require("../controllers/config.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Endpoint para visualizar todas las configuraciones
router.get('/', config_controller_1.ConfigController.getSettings);
// Endpoint para guardar varias configuraciones (requiere sesión iniciada)
router.post('/', auth_middleware_1.requireAuth, config_controller_1.ConfigController.updateSettings);
exports.default = router;
//# sourceMappingURL=config.routes.js.map