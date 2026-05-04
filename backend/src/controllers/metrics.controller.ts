import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';

export class MetricsController {
  static async getHistory(req: Request, res: Response) {
    try {
      const dateString = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const history = await MetricsService.getHistoryByDate(dateString!, limit);
      res.status(200).json(history);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }

  static async getSummary(req: Request, res: Response) {
    try {
      const dateString = (req.query.date as string) || new Date().toISOString().split('T')[0];
      
      const summary = await MetricsService.getSummaryByDate(dateString!);
      res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
}
