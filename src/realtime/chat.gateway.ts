import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { SocketAuthGuard } from './socket-auth.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { REDIS_CHANNELS } from '../redis/redis.constants';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  async handleConnection(client: Socket) {
    // authenticated via guard
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('join_channel')
  async joinChannel(client: Socket, channelId: string) {
    client.join(channelId);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('send_message')
  async sendMessage(
    client: Socket,
    payload: { channelId: string; content: string },
  ) {
    const userId = client.data.user.id;

    await this.messagesService.sendMessage(
      payload.channelId,
      userId,
      payload.content,
    );
  }

  @OnEvent(REDIS_CHANNELS.MESSAGE_CREATED)
  handleMessageFromRedis(payload: any) {
    this.server
      .to(payload.channelId)
      .emit('receive_message', payload.message);
  }
}
