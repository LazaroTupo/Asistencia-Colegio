import prisma from '../config/prisma';

export class ConfigService {
  // Obtener todas las configuraciones y mapearlas como objeto
  static async getSettings(): Promise<Record<string, string>> {
    const settingsArray = await prisma.setting.findMany();
    const settings: Record<string, string> = {};
    
    for (const setting of settingsArray) {
      settings[setting.key] = setting.value;
    }
    
    // Valores por defecto si no existen
    if (!settings['limit_tardanza']) settings['limit_tardanza'] = '08:00';
    if (!settings['evolution_instance']) settings['evolution_instance'] = 'ColegioBot';
    if (!settings['evolution_base_url']) settings['evolution_base_url'] = 'http://localhost:8080';
    
    return settings;
  }

  // Obtener el límite de tardanza en formato "HH:MM"
  static async getTardinessLimit(): Promise<string> {
    const settings = await this.getSettings();
    return settings['limit_tardanza'] ?? '08:00';
  }

  // Guardar múltiples configuraciones
  static async updateSettings(newSettings: Record<string, string>) {
    const promises = Object.entries(newSettings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });
    
    await Promise.all(promises);
    return this.getSettings();
  }

}
