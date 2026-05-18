import { Request, Response } from 'express';
export declare class WhatsappController {
    static getBaseUrl(): string;
    static getHeaders(): Record<string, string>;
    static getInstances(req: Request, res: Response): Promise<void>;
    static createInstance(req: Request, res: Response): Promise<void>;
    static getQrCode(req: Request, res: Response): Promise<void>;
    static getConnectionState(req: Request, res: Response): Promise<void>;
    static logoutInstance(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=whatsapp.controller.d.ts.map