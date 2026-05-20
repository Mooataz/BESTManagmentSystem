import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: true })
export class StockGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;
  afterInit() {
    console.log(':coche_blanche: WebSocket prêt');
  }
  handleConnection(client: Socket) {
    console.log(`:prise_électrique: Client connecté: ${client.id}`);
  }
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`:inbox: ${client.id} a rejoint ${room}`);
  }
  sendStockAlertToUsers(userIds: number[], payload: any) {
    userIds.forEach((id) => {
      this.server.to(`user-${id}`).emit('stock-alert', payload);
    });
  }
}