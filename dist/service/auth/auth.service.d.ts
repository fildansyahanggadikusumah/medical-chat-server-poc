export declare class AuthService {
    private readonly serverClient;
    signup(fullName: string, username: string, password: string): Promise<{
        token: string;
        fullName: string;
        username: string;
        userId: string;
        hashedPassword: string;
    }>;
    signupDoctor(fullName: string, username: string, password: string): Promise<{
        token: string;
        fullName: string;
        username: string;
        userId: string;
        hashedPassword: string;
    }>;
    login(username: string, password: string): Promise<{
        token: string;
        fullName: any;
        username: string;
        userId: any;
    }>;
}
