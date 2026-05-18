"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("../controllers/attendance.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protegemos con requireAuth. Solo usuarios auth pueden registrar.
router.post('/scan', auth_middleware_1.requireAuth, attendance_controller_1.AttendanceController.scanQr);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map