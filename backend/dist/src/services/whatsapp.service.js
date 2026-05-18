"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_service_1 = require("./config.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class WhatsappService {
    /**
     * Envía un mensaje de texto usando Evolution API
     * @param phone Número de teléfono (con código de país)
     * @param message El mensaje de texto a enviar
     */
    static async sendAttendanceNotification(phone, studentName, status, time) {
        try {
            const settings = await config_service_1.ConfigService.getSettings();
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
            const headers = {
                'Content-Type': 'application/json'
            };
            if (apiKey) {
                headers['apikey'] = apiKey;
            }
            // Realizar Peticion HTTP
            await axios_1.default.post(url, payload, { headers });
            console.log(`Mensaje de WhatsApp enviado correctamente a ${phone}`);
        }
        catch (error) {
            console.error('WhatsApp Service Error:', error?.response?.data || error.message);
            // No lanzamos excepcion para no quebrar el flujo de registro de asistencia
        }
    }
}
exports.WhatsappService = WhatsappService;
//# sourceMappingURL=whatsapp.service.js.map