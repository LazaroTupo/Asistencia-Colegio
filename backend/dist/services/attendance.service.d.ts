export declare class AttendanceService {
    static scanQr(qrCode: string, usuarioId: number): Promise<{
        student: {
            firstName: string;
            lastName: string;
            gradeSection: string;
            numApoderado: string | null;
        };
    } & {
        id: number;
        usuarioId: number;
        dateTime: Date;
        status: string;
        studentId: number;
    }>;
}
//# sourceMappingURL=attendance.service.d.ts.map