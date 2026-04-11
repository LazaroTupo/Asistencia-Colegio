import { Request, Response } from 'express';
import { ConfigService } from '../services/config.service';

export class ConfigController {
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await ConfigService.getSettings();
      res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching settings', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const settingsBody = req.body;
      if (!settingsBody || typeof settingsBody !== 'object') {
        res.status(400).json({ error: 'Se requiere un objeto de configuraciones en el body' });
        return;
      }
      
      const newSettings = await ConfigService.updateSettings(settingsBody);
      res.status(200).json({ message: 'Configuraciones actualizadas exitosamente', settings: newSettings });
    } catch (error) {
      console.error('Error updating settings', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
}
