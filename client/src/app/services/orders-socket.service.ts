import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdersSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000/orders');
    this.socket.on('connect', () => {
    });
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  onNewOrder(callback: (order: Order) => void) {
    // attendre que la connexion soit établie avant d’écouter
    if (this.socket.connected) {
      this.socket.on('newOrder', callback);
    } else {
      this.socket.once('connect', () => {
        this.socket.on('newOrder', callback);
      });
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
}
