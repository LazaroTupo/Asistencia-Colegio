import prisma from '../config/prisma';

export class MetricsService {
  // Retorna la lista detallada por día
  static async getHistoryByDate(dateString: string) { // formato YYYY-MM-DD
    const dateStart = new Date(`${dateString}T00:00:00.000Z`);
    const dateEnd = new Date(`${dateString}T23:59:59.999Z`);

    const records = await prisma.attendance.findMany({
      where: {
        dateTime: {
          gte: dateStart,
          lte: dateEnd
        }
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, numApoderado: true }
        },
        usuario: {
          select: { name: true }
        }
      },
      orderBy: { dateTime: 'desc' }
    });

    return records.map(r => ({
      id: r.id,
      nombre: r.student.firstName,
      apellido: r.student.lastName,
      horaEntrada: r.dateTime,
      estado: r.status,
      usuarioEscaneador: r.usuario.name,
      numApoderado: r.student.numApoderado
    }));
  }

  // Retorna el total numérico de cada estado
  static async getSummaryByDate(dateString: string) {
    const dateStart = new Date(`${dateString}T00:00:00.000Z`);
    const dateEnd = new Date(`${dateString}T23:59:59.999Z`);

    const groups = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        dateTime: {
          gte: dateStart,
          lte: dateEnd
        }
      },
      _count: {
        _all: true
      }
    });

    // En Prisma, podemos sacar totales si usamos aggregate, o simplemente sumando. 
    // Para simplificar mapearemos los count resultantes.
    const totals = {
      totalAsistidos: 0, // TEMPRANO + PRESENTE + TARDE
      temprano: 0,
      tarde: 0,
      falto: 0,
    };

    for (const group of groups) {
      if (group.status === 'TEMPRANO' || group.status === 'PRESENTE') {
        totals.temprano += group._count._all;
        totals.totalAsistidos += group._count._all;
      } else if (group.status === 'TARDE') {
        totals.tarde += group._count._all;
        totals.totalAsistidos += group._count._all;
      } else if (group.status === 'FALTO') {
        totals.falto += group._count._all;
      }
    }

    return totals;
  }
}
