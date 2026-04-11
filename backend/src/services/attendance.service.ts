import prisma from '../config/prisma';
import { ConfigService } from './config.service';

export class AttendanceService {
  static async scanQr(qrCode: string, usuarioId: number) {
    // 1. Buscar estudiante
    const student = await prisma.student.findUnique({
      where: { qrCode }
    });

    if (!student) {
      throw new Error('Estudiante no encontrado');
    }

    // 2. Determinar estado (TEMPRANO o TARDE)
    const limitSetting = await ConfigService.getTardinessLimit(); // formato "HH:MM" (ej. "08:15")
    
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
    const attendance = await prisma.attendance.create({
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
      import('./whatsapp.service').then(wtsp => {
        wtsp.WhatsappService.sendAttendanceNotification(
          student.numApoderado as string,
          studentFullName,
          status,
          now
        );
      });
    }

    return attendance;
  }
}
