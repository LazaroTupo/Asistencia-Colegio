"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const metrics_service_1 = require("../services/metrics.service");
class MetricsController {
    static async getHistory(req, res) {
        try {
            const dateString = req.query.date || new Date().toISOString().split('T')[0];
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const history = await metrics_service_1.MetricsService.getHistoryByDate(dateString, limit);
            res.status(200).json(history);
        }
        catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
    static async getSummary(req, res) {
        try {
            const dateString = req.query.date || new Date().toISOString().split('T')[0];
            const summary = await metrics_service_1.MetricsService.getSummaryByDate(dateString);
            res.status(200).json(summary);
        }
        catch (error) {
            console.error('Error fetching summary:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
}
exports.MetricsController = MetricsController;
//# sourceMappingURL=metrics.controller.js.map