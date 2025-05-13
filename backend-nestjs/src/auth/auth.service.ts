import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateLoginDTO } from './dto/create-login.dto';
import * as argon2  from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    constructor (
       @InjectRepository(User) private readonly userRepositry:Repository<User>,
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async signIn(createLoginDTO:CreateLoginDTO){
        // Check User
        const user = await this.userService.findUserByLogin(createLoginDTO.login);
        if(!user){ throw new BadRequestException('User not found by this login')};

        //Check password
        const passwordMatches = await argon2.verify(user.password, createLoginDTO.password);
        if(!passwordMatches){ throw new BadRequestException('Incorrect password')};

        //if(user.refreshToken !== null) { throw new BadRequestException('User already connected')} // verifier si user deja connecter

        // Generate Token
        const token = await this.generateTokens(user.id, user.login)

        await this.updateRefreshToken(user.id, token.refreshToken)
        return {user, token}

    }
    
    async findUserById(id: number) {
        const user = await this.userRepositry.findOne({
          where: { id },
          select: ['id', 'name', 'role', 'login', 'status'], // ce que tu veux retourner
        });
        return user;
      }
         
    async generateTokens(userId: number, login: string){
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                    expiresIn: "1d"
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                    expiresIn: "1d"
                }
            )
        ])
        return {accessToken, refreshToken}
    }

    async updateRefreshToken( userId: number, refreshToken: string ){
        const hashedRefresh = await argon2.hash(refreshToken);
        await this.userService.update(userId, {refreshToken: hashedRefresh })
    }

    async logout (userId: number){
        await this.userService.update(userId, {refreshToken: null})
    }


    async updatePassword (id: number,currentPassword: string, newPassword: string){
        // Check User
        const user = await this.userService.findOne(id);
        if(!user){ throw new BadRequestException('User not found by this login')};
        
        const passwordMatches = await argon2.verify(user.password, currentPassword);
        if(!passwordMatches){ throw new BadRequestException('Incorrect password')};
        
        const pass = await argon2.hash(newPassword);
        await this.userService.update(id, {password: pass})

        const token = await this.generateTokens(user.id, user.login)

        await this.updateRefreshToken(user.id, token.refreshToken)
        return {user, token}
    }
}
