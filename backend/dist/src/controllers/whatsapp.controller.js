"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const axios_1 = __importDefault(require("axios"));
class WhatsappController {
    static getBaseUrl() {
        return process.env.EVOLUTION_API_URL || 'http://localhost:8080';
    }
    static getHeaders() {
        const apiKey = process.env.EVOLUTION_API_KEY;
        const headers = {
            'Content-Type': 'application/json'
        };
        if (apiKey) {
            headers['apikey'] = apiKey;
        }
        return headers;
    }
    static async getInstances(req, res) {
        try {
            const url = `${WhatsappController.getBaseUrl()}/instance/fetchInstances`;
            const response = await axios_1.default.get(url, { headers: WhatsappController.getHeaders() });
            // Evolution API suele devolver un array de instancias
            res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Error getting instances:', error?.response?.data || error.message);
            res.status(500).json({ error: 'Error obteniendo instancias de WhatsApp' });
        }
    }
    static async createInstance(req, res) {
        try {
            const { instanceName } = req.body;
            if (!instanceName) {
                res.status(400).json({ error: 'El nombre de la instancia es requerido' });
                return;
            }
            const url = `${WhatsappController.getBaseUrl()}/instance/create`;
            const payload = {
                instanceName,
                token: instanceName, // un token simple asociado
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
            };
            const response = await axios_1.default.post(url, payload, { headers: WhatsappController.getHeaders() });
            res.status(201).json(response.data);
        }
        catch (error) {
            console.error('Error creating instance:', error?.response?.data || error.message);
            res.status(500).json({ error: 'Error creando instancia de WhatsApp' });
        }
    }
    static async getQrCode(req, res) {
        try {
            const { instanceName } = req.params;
            const url = `${WhatsappController.getBaseUrl()}/instance/connect/${instanceName}`;
            const response = await axios_1.default.get(url, { headers: WhatsappController.getHeaders() });
            res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Error getting QR:', error?.response?.data || error.message);
            res.status(500).json({ error: 'Error obteniendo QR de conexión' });
        }
    }
    static async getConnectionState(req, res) {
        try {
            const { instanceName } = req.params;
            const url = `${WhatsappController.getBaseUrl()}/instance/connectionState/${instanceName}`;
            const response = await axios_1.default.get(url, { headers: WhatsappController.getHeaders() });
            res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Error getting state:', error?.response?.data || error.message);
            res.status(500).json({ error: 'Error obteniendo estado de conexión' });
        }
    }
    static async logoutInstance(req, res) {
        try {
            const { instanceName } = req.params;
            const url = `${WhatsappController.getBaseUrl()}/instance/logout/${instanceName}`;
            const response = await axios_1.default.delete(url, { headers: WhatsappController.getHeaders() });
            res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Error logging out:', error?.response?.data || error.message);
            res.status(500).json({ error: 'Error cerrando sesión de WhatsApp' });
        }
    }
}
exports.WhatsappController = WhatsappController;
//# sourceMappingURL=whatsapp.controller.js.map