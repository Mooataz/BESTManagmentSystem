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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let StockGateway = class StockGateway {
    server;
    afterInit() {
        console.log(':coche_blanche: WebSocket prêt');
    }
    handleConnection(client) {
        console.log(`:prise_électrique: Client connecté: ${client.id}`);
    }
    handleJoinRoom(client, room) {
        client.join(room);
        console.log(`:inbox: ${client.id} a rejoint ${room}`);
    }
    sendStockAlertToUsers(userIds, payload) {
        userIds.forEach((id) => {
            this.server.to(`user-${id}`).emit('stock-alert', payload);
        });
    }
};
exports.StockGateway = StockGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StockGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], StockGateway.prototype, "handleJoinRoom", null);
exports.StockGateway = StockGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], StockGateway);
//# sourceMappingURL=Stock.Gateway.js.map