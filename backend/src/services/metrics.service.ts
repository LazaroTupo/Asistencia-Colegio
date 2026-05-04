import prisma from '../config/prisma';

export class MetricsService {
  // Retorna la lista detallada por día
  static async getHistoryByDate(dateString: string, limit?: number) { // formato YYYY-MM-DD
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
          select: { firstName: true, lastName: true, gradeSection: true }
        }
      },
      orderBy: { dateTime: 'desc' },
      take: limit
    });

    return records;
  }

  // Retorna el total numérico de cada estado
  static async getSummaryByDate(dateString: string) {
    const dateStart = new Date(`${dateString}T00:00:00.000Z`);
    const dateEnd = new Date(`${dateString}T23:59:59.999Z`);

    const [groups, totalStudents] = await Promise.all([
      prisma.attendance.groupBy({
        by: ['status'],
        where: {
          dateTime: {
            gte: dateStart,
            lte: dateEnd
          }
        },
        _count: { _all: true }
      }),
      prisma.student.count()
    ]);

    const summary = {
      total: totalStudents,
      presentes: 0,
      temprano: 0,
      tarde: 0,
      faltas: 0,
    };

    let totalAsistidos = 0;
    for (const group of groups) {
      const count = group._count._all;
      if (group.status === 'TEMPRANO' || group.status === 'PRESENTE') {
        summary.temprano += count;
        totalAsistidos += count;
      } else if (group.status === 'TARDE') {
        summary.tarde += count;
        totalAsistidos += count;
      } else if (group.status === 'FALTO') {
        summary.faltas += count;
      }
    }
    
    summary.presentes = totalAsistidos;
    // Las faltas también se pueden calcular como Total - Presentes
    summary.faltas = Math.max(0, totalStudents - totalAsistidos);

    return summary;
  }
}
