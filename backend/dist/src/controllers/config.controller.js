"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const config_service_1 = require("../services/config.service");
class ConfigController {
    static async getSettings(req, res) {
        try {
            const settings = await config_service_1.ConfigService.getSettings();
            res.status(200).json(settings);
        }
        catch (error) {
            console.error('Error fetching settings', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
    static async updateSettings(req, res) {
        try {
            const settingsBody = req.body;
            if (!settingsBody || typeof settingsBody !== 'object') {
                res.status(400).json({ error: 'Se requiere un objeto de configuraciones en el body' });
                return;
            }
            const newSettings = await config_service_1.ConfigService.updateSettings(settingsBody);
            res.status(200).json({ message: 'Configuraciones actualizadas exitosamente', settings: newSettings });
        }
        catch (error) {
            console.error('Error updating settings', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
}
exports.ConfigController = ConfigController;
//# sourceMappingURL=config.controller.js.map