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
exports.ReceptionistController = void 0;
const common_1 = require("@nestjs/common");
const receptionist_service_1 = require("./receptionist.service");
const create_receptionist_dto_1 = require("./dto/create-receptionist.dto");
const update_receptionist_dto_1 = require("./dto/update-receptionist.dto");
let ReceptionistController = class ReceptionistController {
    receptionistService;
    constructor(receptionistService) {
        this.receptionistService = receptionistService;
    }
    create(createReceptionistDto) {
        return this.receptionistService.create(createReceptionistDto);
    }
    findAll() {
        return this.receptionistService.findAll();
    }
    findOne(id) {
        return this.receptionistService.findOne(+id);
    }
    update(id, updateReceptionistDto) {
        return this.receptionistService.update(+id, updateReceptionistDto);
    }
    remove(id) {
        return this.receptionistService.remove(+id);
    }
};
exports.ReceptionistController = ReceptionistController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_receptionist_dto_1.CreateReceptionistDto]),
    __metadata("design:returntype", void 0)
], ReceptionistController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReceptionistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReceptionistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_receptionist_dto_1.UpdateReceptionistDto]),
    __metadata("design:returntype", void 0)
], ReceptionistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReceptionistController.prototype, "remove", null);
exports.ReceptionistController = ReceptionistController = __decorate([
    (0, common_1.Controller)('receptionist'),
    __metadata("design:paramtypes", [receptionist_service_1.ReceptionistService])
], ReceptionistController);
//# sourceMappingURL=receptionist.controller.js.map