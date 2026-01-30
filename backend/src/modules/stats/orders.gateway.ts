import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from 'src/database/entities';

@WebSocketGateway({ namespace: '/orders', cors: true })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  // Envoyer une notification quand une nouvelle commande est créée
  newOrder(order: Order) {
    this.server.emit('newOrder', order);
  }
}
