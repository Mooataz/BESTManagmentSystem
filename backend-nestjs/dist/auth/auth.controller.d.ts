import { AuthService } from './auth.service';
import { CreateLoginDTO } from './dto/create-login.dto';
import { Request } from 'express';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sigIn(createLoginDTO: CreateLoginDTO, res: Response): Promise<{
        user: import("../users/entities/user.entity").User;
    }>;
    logout(req: Request): Promise<void>;
    getUserId(id: number, res: any): Promise<void>;
    getMe(req: Request): Promise<import("../users/entities/user.entity").User | null>;
    updatePassword(userId: number, passwordDTO: {
        currentPassword: string;
        newPassword: string;
    }, res: any): Promise<any>;
}
