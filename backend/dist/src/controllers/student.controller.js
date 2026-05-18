"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StudentController {
    static async getAll(req, res) {
        try {
            const students = await prisma.student.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.json(students);
        }
        catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Error al obtener estudiantes' });
        }
    }
    static async create(req, res) {
        try {
            const { qrCode, firstName, lastName, gradeSection, numApoderado, details } = req.body;
            if (!qrCode || !firstName || !lastName || !gradeSection) {
                res.status(400).json({ error: 'Faltan campos obligatorios' });
                return;
            }
            const existing = await prisma.student.findUnique({ where: { qrCode } });
            if (existing) {
                res.status(400).json({ error: 'El código QR ya está registrado a otro estudiante' });
                return;
            }
            const newStudent = await prisma.student.create({
                data: { qrCode, firstName, lastName, gradeSection, numApoderado, details }
            });
            res.status(201).json(newStudent);
        }
        catch (error) {
            console.error('Error creating student:', error);
            res.status(500).json({ error: 'Error al crear estudiante' });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { qrCode, firstName, lastName, gradeSection, numApoderado, details } = req.body;
            if (qrCode) {
                const existing = await prisma.student.findUnique({ where: { qrCode } });
                if (existing && existing.id !== id) {
                    res.status(400).json({ error: 'El código QR ya está registrado a otro estudiante' });
                    return;
                }
            }
            const updatedStudent = await prisma.student.update({
                where: { id },
                data: { qrCode, firstName, lastName, gradeSection, numApoderado, details }
            });
            res.json(updatedStudent);
        }
        catch (error) {
            console.error('Error updating student:', error);
            res.status(500).json({ error: 'Error al actualizar estudiante' });
        }
    }
    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            // Borrar primero sus asistencias
            await prisma.attendance.deleteMany({
                where: { studentId: id }
            });
            await prisma.student.delete({
                where: { id }
            });
            res.json({ message: 'Estudiante eliminado exitosamente' });
        }
        catch (error) {
            console.error('Error deleting student:', error);
            res.status(500).json({ error: 'Error al eliminar estudiante' });
        }
    }
}
exports.StudentController = StudentController;
//# sourceMappingURL=student.controller.js.map