import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@colegio.edu' },
    update: {
      password: hashedPassword
    },
    create: {
      name: 'admin',
      email: 'admin@colegio.edu',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Usuario creado:', user.name, 'Contraseña:', 'admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // error exit removed
  });
