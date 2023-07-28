import { AuthService } from 'src/service/auth/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: any): Promise<{
        token: string;
        fullName: string;
        username: string;
        userId: string;
        hashedPassword: string;
    }>;
    signupDoctor(body: any): Promise<{
        token: string;
        fullName: string;
        username: string;
        userId: string;
        hashedPassword: string;
    }>;
    login(body: any): Promise<{
        token: string;
        fullName: any;
        username: string;
        userId: any;
    }>;
}
