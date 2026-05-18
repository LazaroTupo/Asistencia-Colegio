"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ConfigService {
    // Obtener todas las configuraciones y mapearlas como objeto
    static async getSettings() {
        const settingsArray = await prisma_1.default.setting.findMany();
        const settings = {};
        for (const setting of settingsArray) {
            settings[setting.key] = setting.value;
        }
        // Valores por defecto si no existen
        if (!settings['limit_tardanza'])
            settings['limit_tardanza'] = '08:00';
        if (!settings['evolution_instance'])
            settings['evolution_instance'] = 'ColegioBot';
        if (!settings['evolution_base_url'])
            settings['evolution_base_url'] = 'http://localhost:8080';
        return settings;
    }
    // Obtener el límite de tardanza en formato "HH:MM"
    static async getTardinessLimit() {
        const settings = await this.getSettings();
        return settings['limit_tardanza'] ?? '08:00';
    }
    // Guardar múltiples configuraciones
    static async updateSettings(newSettings) {
        const promises = Object.entries(newSettings).map(([key, value]) => {
            return prisma_1.default.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });
        await Promise.all(promises);
        return this.getSettings();
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map