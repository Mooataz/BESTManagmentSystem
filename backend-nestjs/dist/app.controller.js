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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const fs_1 = require("fs");
const path_1 = require("path");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    cleanText(input) {
        return this.appService.cleanSpaces(input);
    }
    getHello() {
        return this.appService.getHello();
    }
    readFile(folder, img) {
        const file = (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), '/upload/' + folder + '/' + img));
        return new common_1.StreamableFile(file);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('clean'),
    __param(0, (0, common_1.Query)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], AppController.prototype, "cleanText", null);
__decorate([
    (0, common_1.Get)('hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/file/:folder/:img'),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('img')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "readFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('apiApp'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map