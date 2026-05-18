"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metrics_controller_1 = require("../controllers/metrics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protegemos para que solo directivos/admin consulten si se requiere, de momento auth basta.
router.get('/history', auth_middleware_1.requireAuth, metrics_controller_1.MetricsController.getHistory);
router.get('/summary', auth_middleware_1.requireAuth, metrics_controller_1.MetricsController.getSummary);
exports.default = router;
//# sourceMappingURL=metrics.routes.js.map