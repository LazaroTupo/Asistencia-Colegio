"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async login(req, res) {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                res.status(400).json({ error: 'Nombre y contraseña son requeridos' });
                return;
            }
            const user = await auth_service_1.AuthService.authenticateUser(name, password);
            if (!user) {
                res.status(401).json({ error: 'Credenciales inválidas' });
                return;
            }
            // Guardar id_usuario y rol en la sesión
            req.session.usuarioId = user.id;
            req.session.role = user.role;
            res.status(200).json({
                message: 'Login exitoso',
                user: { id: user.id, name: user.name, role: user.role }
            });
        }
        catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ error: 'No se pudo cerrar la sesión' });
                return;
            }
            res.clearCookie('connect.sid'); // connect.sid es por defecto el nombre de la cookie
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map