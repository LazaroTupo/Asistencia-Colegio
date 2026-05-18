import axios from 'axios';
import { ConfigService } from './config.service';
import dotenv from 'dotenv';
dotenv.config();

export class WhatsappService {
  /**
   * Envía un mensaje de texto usando Evolution API
   * @param phone Número de teléfono (con código de país)
   * @param message El mensaje de texto a enviar
   */
  static async sendAttendanceNotification(phone: string, studentName: string, status: string, time: Date) {
    try {
      const settings = await ConfigService.getSettings();
      const instance = settings['evolution_instance'];
      const baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
      const apiKey = process.env.EVOLUTION_API_KEY;

      if (!instance) {
        console.warn('WathasApp Service: No se ha configurado la instancia activa.');
        return;
      }

      // Preparar mensaje
      // Format time safely, e.g. "08:15 AM"
      const timeString = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const text = `Estimado apoderado, le informamos que el estudiante ${studentName} registró su ingreso escolar al estado *${status}* a las ${timeString}.`;

      // API URL
      const url = `${baseUrl}/message/sendText/${instance}`;
      
      const payload = {
        number: phone,
        text: text
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (apiKey) {
        headers['apikey'] = apiKey;
      }

      // Realizar Peticion HTTP
      await axios.post(url, payload, { headers });
      console.log(`Mensaje de WhatsApp enviado correctamente a ${phone}`);

    } catch (error: any) {
      console.error('WhatsApp Service Error:', error?.response?.data || error.message);
      // No lanzamos excepcion para no quebrar el flujo de registro de asistencia
    }
  }
}
