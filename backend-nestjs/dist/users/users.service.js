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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../permission/entities/permission.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const app_service_1 = require("../app.service");
let UsersService = class UsersService {
    userRepositry;
    permissionRepositry;
    branchRepositry;
    appService;
    constructor(userRepositry, permissionRepositry, branchRepositry, appService) {
        this.userRepositry = userRepositry;
        this.permissionRepositry = permissionRepositry;
        this.branchRepositry = branchRepositry;
        this.appService = appService;
    }
    async create(createUserDto) {
        createUserDto.name = this.appService.cleanSpaces(createUserDto.name);
        createUserDto.login = this.appService.cleanSpaces(createUserDto.login);
        const permissions = await this.permissionRepositry.find({ where: { id: (0, typeorm_2.In)(createUserDto.permissionsIds) } });
        const branch = createUserDto.branch ? await this.branchRepositry.findOne({ where: { id: createUserDto.branch } }) : undefined;
        if (!permissions.length) {
            throw new common_1.NotFoundException("No valid permissions found.");
        }
        if (!branch) {
            throw new common_1.NotFoundException("No valid branch found.");
        }
        const newCreate = this.userRepositry.create({ ...createUserDto, branch: branch || undefined, permissions, role: Array.isArray(createUserDto.role)
                ? createUserDto.role : [createUserDto.role], });
        return await this.userRepositry.save(newCreate);
    }
    async findAll() {
        const allUsers = await this.userRepositry.find();
        if (!allUsers || allUsers.length === 0) {
            throw new common_1.NotFoundException("There is no users data Available");
        }
        return allUsers;
    }
    async findOne(id) {
        const OneUser = await this.userRepositry.findOne({ where: { id } });
        if (!OneUser) {
            throw new common_1.NotFoundException("There is no user data Available");
        }
        return OneUser;
    }
    async update(id, updateUserDto) {
        const { branch, permissionsIds, ...rest } = updateUserDto;
        const updateData = { ...rest, role: rest.role ? (Array.isArray(rest.role) ? rest.role : [rest.role]) : undefined,
        };
        if (branch) {
            const branchEntity = await this.branchRepositry.findOne({ where: { id: branch } });
            if (!branchEntity) {
                throw new common_1.NotFoundException("Branch not found");
            }
            updateData.branch = branchEntity;
        }
        if (permissionsIds) {
            const permissions = await this.permissionRepositry.find({ where: { id: (0, typeorm_2.In)(permissionsIds) } });
            updateData.permissions = permissions;
        }
        await this.userRepositry.update(id, updateData);
        const updatedUser = await this.userRepositry.findOne({ where: { id }, relations: ['branch', 'permissions'] });
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found after update');
        }
        return updatedUser;
    }
    async remove(id) {
        const deletedata = await this.userRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('user Not found for delete = failed');
        }
        await this.userRepositry.delete(id);
        return deletedata;
    }
    async findByBranchId(branchId) {
        const findAll = await this.userRepositry
            .createQueryBuilder("User")
            .leftJoinAndSelect("User.branch", "branch")
            .where("branch.id = :branchId", { branchId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByStatus(status) {
        const findAll = await this.userRepositry
            .createQueryBuilder("User")
            .where("status = :status", { status })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findUserByLogin(login) {
        const userByLogin = await this.userRepositry.findOne({ where: { login } });
        if (!userByLogin) {
            throw new common_1.NotFoundException('User not found');
        }
        ;
        return userByLogin;
    }
    async getUsersByRole(role) {
        return this.userRepositry.find({ where: { role } });
    }
    async getAllUsersSortedByRole() {
        return this.userRepositry
            .createQueryBuilder('user')
            .orderBy('user.role', 'ASC')
            .addOrderBy('user.name', 'ASC')
            .getMany();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], UsersService);
//# sourceMappingURL=users.service.js.map