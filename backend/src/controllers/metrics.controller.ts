import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';

export class MetricsController {
  static async getHistory(req: Request, res: Response) {
    try {
      const dateString = req.query.date as string;
      if (!dateString) {
        res.status(400).json({ error: 'Falta el parámetro query "date" (YYYY-MM-DD)' });
        return;
      }
      
      const history = await MetricsService.getHistoryByDate(dateString);
      res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const dateString = req.query.date as string;
      if (!dateString) {
        res.status(400).json({ error: 'Falta el parámetro query "date" (YYYY-MM-DD)' });
        return;
      }
      
      const summary = await MetricsService.getSummaryByDate(dateString);
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
}
