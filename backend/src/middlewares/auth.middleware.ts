import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.usuarioId) {
    res.status(401).json({ error: 'No autorizado. Por favor inicie sesión.' });
    return;
  }
  next();
};
