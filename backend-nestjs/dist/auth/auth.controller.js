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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_login_dto_1 = require("./dto/create-login.dto");
const accessToken_guard_1 = require("../guards/accessToken.guard");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    sigIn(createLoginDTO) {
        return this.authService.signIn(createLoginDTO);
    }
    logout(req) {
        const user = req.user;
        const userId = user.sub;
        return this.authService.logout(userId);
    }
    getMe(req) {
        const user = req.user;
        return this.authService.findUserById(user.sub);
    }
    async updatePassword(userId, passwordDTO, res) {
        try {
            const updateType = await this.authService.updatePassword(userId, passwordDTO.currentPassword, passwordDTO.newPassword);
            return res.status(common_1.HttpStatus.OK).json({
                message: "updated Successfuly !",
                status: common_1.HttpStatus.OK,
                data: updateType
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signIn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_login_dto_1.CreateLoginDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sigIn", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    (0, common_1.Patch)('password/:userId'),
    (0, swagger_1.ApiBody)({
        description: 'Change user password',
        type: Object,
        schema: {
            type: 'object',
            properties: {
                currentPassword: { type: 'string' },
                newPassword: { type: 'string' },
            },
            required: ['currentPassword', 'newPassword'],
        },
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map