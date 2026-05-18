import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando base de datos...');
  await prisma.attendance.deleteMany();
  await prisma.student.deleteMany();
  
  console.log('Creando o actualizando usuario superadmin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@colegio.edu' },
    update: { password: hashedPassword, role: 'ADMIN', name: 'SuperAdmin' },
    create: {
      name: 'SuperAdmin',
      email: 'admin@colegio.edu',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Base de datos inicializada correctamente. Cuenta de superadmin lista.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
