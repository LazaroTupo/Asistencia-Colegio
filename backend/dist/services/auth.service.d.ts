export declare class AuthService {
    static authenticateUser(name: string, passwordPlain: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
//# sourceMappingURL=auth.service.d.ts.map