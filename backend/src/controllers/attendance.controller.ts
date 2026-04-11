import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';

export class AttendanceController {
  static async scanQr(req: Request, res: Response) {
    try {
      const { qrCode } = req.body;
      const usuarioId = req.session.usuarioId; // Provisto por el middleware auth

      if (!qrCode) {
        res.status(400).json({ error: 'El parámetro qrCode es requerido' });
        return;
      }

      if (!usuarioId) {
        res.status(401).json({ error: 'Usuario no autenticado en la sesión' });
        return;
      }

      const record = await AttendanceService.scanQr(qrCode, usuarioId);

      // Devuelve estado y los datos del estudiante recién registrado
      res.status(200).json({
        message: 'Asistencia registrada correctamente',
        record
      });
    } catch (error: any) {
      console.error('Error scanning QR:', error);
      if (error.message === 'Estudiante no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error del servidor registrando asistencia' });
      }
    }
  }
}
