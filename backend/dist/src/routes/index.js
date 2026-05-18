"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const config_routes_1 = __importDefault(require("./config.routes"));
const attendance_routes_1 = __importDefault(require("./attendance.routes"));
const metrics_routes_1 = __importDefault(require("./metrics.routes"));
const whatsapp_routes_1 = __importDefault(require("./whatsapp.routes"));
const student_routes_1 = __importDefault(require("./student.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/config', config_routes_1.default);
router.use('/attendance', attendance_routes_1.default);
router.use('/metrics', metrics_routes_1.default);
router.use('/whatsapp', whatsapp_routes_1.default);
router.use('/students', student_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map