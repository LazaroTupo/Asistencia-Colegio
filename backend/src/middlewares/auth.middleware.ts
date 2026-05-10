import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.usuarioId) {
    res.status(401).json({ error: 'No autorizado. Por favor inicie sesión.' });
    return;
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.usuarioId) {
    res.status(401).json({ error: 'No autorizado. Por favor inicie sesión.' });
    return;
  }
  
  if (req.session.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    return;
  }
  
  next();
};
