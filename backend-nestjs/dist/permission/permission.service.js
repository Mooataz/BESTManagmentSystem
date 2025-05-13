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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permission_entity_1 = require("./entities/permission.entity");
const typeorm_2 = require("typeorm");
let PermissionService = class PermissionService {
    permissionRepositry;
    constructor(permissionRepositry) {
        this.permissionRepositry = permissionRepositry;
    }
    async create(createPermissionDto) {
        return await this.permissionRepositry.save(createPermissionDto);
    }
    async findAll() {
        const allPermissions = await this.permissionRepositry.find();
        if (!allPermissions || allPermissions.length === 0) {
            throw new common_1.NotFoundException('There is no permissions available');
        }
        return allPermissions;
    }
    async findOne(id) {
        const onePermission = await this.permissionRepositry.findOne({ where: { id } });
        if (!onePermission) {
            throw new common_1.NotFoundException('No permission available');
        }
        return onePermission;
    }
    async update(id, updatePermissionDto) {
        await this.permissionRepositry.update(id, updatePermissionDto);
        const updateData = await this.permissionRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('Permission not found to update');
        }
        return updateData;
    }
    async remove(id) {
        const deletedata = await this.permissionRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Permission  Not found for delete');
        }
        await this.permissionRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map