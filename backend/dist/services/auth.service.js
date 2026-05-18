"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
class AuthService {
    static async authenticateUser(name, passwordPlain) {
        const user = await prisma_1.default.user.findFirst({
            where: { name }
        });
        if (!user) {
            return null;
        }
        const isValidPassword = await bcryptjs_1.default.compare(passwordPlain, user.password);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map