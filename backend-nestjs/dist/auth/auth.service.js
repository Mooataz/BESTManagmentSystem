"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const argon2 = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let AuthService = class AuthService {
    userRepositry;
    userService;
    jwtService;
    configService;
    constructor(userRepositry, userService, jwtService, configService) {
        this.userRepositry = userRepositry;
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signIn(createLoginDTO) {
        const user = await this.userService.findUserByLogin(createLoginDTO.login);
        if (!user) {
            throw new common_1.BadRequestException('User not found by this login');
        }
        ;
        const passwordMatches = await argon2.verify(user.password, createLoginDTO.password);
        if (!passwordMatches) {
            throw new common_1.BadRequestException('Incorrect password');
        }
        ;
        const token = await this.generateTokens(user.id, user.login);
        await this.updateRefreshToken(user.id, token.refreshToken);
        return { user, token };
    }
    async findUserById(id) {
        const user = await this.userRepositry.findOne({
            where: { id },
            relations: ['branch'],
            select: ['id', 'name', 'role', 'login', 'status'],
        });
        return user;
    }
    async generateTokens(userId, login) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                login
            }, {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: "1d"
            }),
            this.jwtService.signAsync({
                sub: userId,
                login
            }, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: "1d"
            })
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefresh = await argon2.hash(refreshToken);
        await this.userService.update(userId, { refreshToken: hashedRefresh });
    }
    async logout(userId) {
        await this.userService.update(userId, { refreshToken: null });
    }
    async updatePassword(id, currentPassword, newPassword) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new common_1.BadRequestException('User not found by this login');
        }
        ;
        const passwordMatches = await argon2.verify(user.password, currentPassword);
        if (!passwordMatches) {
            throw new common_1.BadRequestException('Incorrect password');
        }
        ;
        const pass = await argon2.hash(newPassword);
        await this.userService.update(id, { password: pass });
        const token = await this.generateTokens(user.id, user.login);
        await this.updateRefreshToken(user.id, token.refreshToken);
        return { user, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map