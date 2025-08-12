import { OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class StockGateway implements OnGatewayInit, OnGatewayConnection {
    server: Server;
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleJoinRoom(client: Socket, room: string): void;
    sendStockAlertToUsers(userIds: number[], payload: any): void;
}
