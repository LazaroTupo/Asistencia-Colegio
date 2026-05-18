"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const config_service_1 = require("./config.service");
class AttendanceService {
    static async scanQr(qrCode, usuarioId) {
        // 1. Buscar estudiante
        const student = await prisma_1.default.student.findUnique({
            where: { qrCode }
        });
        if (!student) {
            throw new Error('Estudiante no encontrado');
        }
        // 2. Determinar estado (TEMPRANO o TARDE)
        const limitSetting = await config_service_1.ConfigService.getTardinessLimit(); // formato "HH:MM" (ej. "08:15")
        const now = new Date();
        // Extraer limit horas y minutos
        const [limitHour, limitMinute] = limitSetting.split(':').map(Number);
        // Crear objeto Date para el límite en el día de hoy
        const limitTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), limitHour, limitMinute, 0);
        let status = 'TEMPRANO';
        if (now > limitTime) {
            status = 'TARDE';
        }
        // 3. Crear el registro
        const attendance = await prisma_1.default.attendance.create({
            data: {
                studentId: student.id,
                usuarioId,
                status, // Automáticamente TEMPRANO o TARDE
            },
            include: {
                student: { select: { firstName: true, lastName: true, gradeSection: true, numApoderado: true } }
            }
        });
        // 4. Enviar notificación asíncrona si hay un apoderado
        if (student.numApoderado) {
            const studentFullName = `${student.firstName} ${student.lastName}`;
            // Importante no hacer await para que la API responda rápido antes de enviar SMS
            Promise.resolve().then(() => __importStar(require('./whatsapp.service'))).then(wtsp => {
                wtsp.WhatsappService.sendAttendanceNotification(student.numApoderado, studentFullName, status, now);
            });
        }
        return attendance;
    }
}
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendance.service.js.map