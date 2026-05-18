import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigService } from '../services/config.service';

export class WhatsappController {
  
  static getBaseUrl(): string {
    return process.env.EVOLUTION_API_URL || 'http://localhost:8080';
  }

  static getHeaders() {
    const apiKey = process.env.EVOLUTION_API_KEY;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (apiKey) {
      headers['apikey'] = apiKey;
    }
    return headers;
  }

  static async getInstances(req: Request, res: Response) {
    try {
      const url = `${WhatsappController.getBaseUrl()}/instance/fetchInstances`;
      const response = await axios.get(url, { headers: WhatsappController.getHeaders() });
      
      // Evolution API suele devolver un array de instancias
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error getting instances:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Error obteniendo instancias de WhatsApp' });
    }
  }

  static async createInstance(req: Request, res: Response) {
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

      const response = await axios.post(url, payload, { headers: WhatsappController.getHeaders() });
      res.status(201).json(response.data);
    } catch (error: any) {
      console.error('Error creating instance:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Error creando instancia de WhatsApp' });
    }
  }

  static async getQrCode(req: Request, res: Response) {
    try {
      const { instanceName } = req.params;
      const url = `${WhatsappController.getBaseUrl()}/instance/connect/${instanceName}`;
      
      const response = await axios.get(url, { headers: WhatsappController.getHeaders() });
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error getting QR:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Error obteniendo QR de conexión' });
    }
  }

  static async getConnectionState(req: Request, res: Response) {
    try {
      const { instanceName } = req.params;
      const url = `${WhatsappController.getBaseUrl()}/instance/connectionState/${instanceName}`;
      
      const response = await axios.get(url, { headers: WhatsappController.getHeaders() });
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error getting state:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Error obteniendo estado de conexión' });
    }
  }

  static async logoutInstance(req: Request, res: Response) {
    try {
      const { instanceName } = req.params;
      const url = `${WhatsappController.getBaseUrl()}/instance/logout/${instanceName}`;
      
      const response = await axios.delete(url, { headers: WhatsappController.getHeaders() });
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error logging out:', error?.response?.data || error.message);
      res.status(500).json({ error: 'Error cerrando sesión de WhatsApp' });
    }
  }
}
