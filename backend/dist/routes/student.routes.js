"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas las rutas requieren rol de ADMIN
router.use(auth_middleware_1.requireAdmin);
router.get('/', student_controller_1.StudentController.getAll);
router.post('/', student_controller_1.StudentController.create);
router.put('/:id', student_controller_1.StudentController.update);
router.delete('/:id', student_controller_1.StudentController.delete);
exports.default = router;
//# sourceMappingURL=student.routes.js.map