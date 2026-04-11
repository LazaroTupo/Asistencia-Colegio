import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';

export class AuthService {
  static async authenticateUser(name: string, passwordPlain: string) {
    const user = await prisma.user.findFirst({
      where: { name }
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(passwordPlain, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}
