export declare class MetricsService {
    static getHistoryByDate(dateString: string, limit?: number): Promise<({
        student: {
            firstName: string;
            lastName: string;
            gradeSection: string;
        };
    } & {
        id: number;
        usuarioId: number;
        dateTime: Date;
        status: string;
        studentId: number;
    })[]>;
    static getSummaryByDate(dateString: string): Promise<{
        total: number;
        presentes: number;
        temprano: number;
        tarde: number;
        faltas: number;
    }>;
}
//# sourceMappingURL=metrics.service.d.ts.map