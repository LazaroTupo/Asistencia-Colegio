"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.usuarioId) {
        res.status(401).json({ error: 'No autorizado. Por favor inicie sesión.' });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
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
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.middleware.js.map