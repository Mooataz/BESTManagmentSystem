import { UsersService } from 'src/users/users.service';
import { CreateLoginDTO } from './dto/create-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userRepositry;
    private userService;
    private jwtService;
    private configService;
    constructor(userRepositry: Repository<User>, userService: UsersService, jwtService: JwtService, configService: ConfigService);
    signIn(createLoginDTO: CreateLoginDTO): Promise<{
        user: User;
        token: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    findUserById(id: number): Promise<User | null>;
    generateTokens(userId: number, login: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    logout(userId: number): Promise<void>;
    updatePassword(id: number, currentPassword: string, newPassword: string): Promise<{
        user: User;
        token: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
}
