import { UseGuards, ForbiddenException } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagesService } from '../messages/messages.service';
import { SocketAuthGuard } from './socket-auth.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { REDIS_CHANNELS } from '../redis/redis.constants';
import { ChannelMember } from '../entities/channel-member.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    @InjectRepository(ChannelMember)
    private channelMembersRepo: Repository<ChannelMember>
  ) { }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // 🔐 Join channel (room)
  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('join_channel')
  async joinChannel(client: Socket, channelId: string) {
    console.log('📥 Joining channel:', channelId);
    client.join(channelId);
    return { success: true, channel: channelId };
  }

  // 💬 Send message
  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('send_message')
  async sendMessage(
    client: Socket,
    payload: any,  // Change to 'any' temporarily to debug
  ) {
    console.log('=== SEND MESSAGE DEBUG ===');
    console.log('Raw payload type:', typeof payload);
    console.log('Raw payload:', JSON.stringify(payload, null, 2));
    console.log('payload.channelId:', payload?.channelId);
    console.log('payload.content:', payload?.content);

    const userId = client.data.user.id;
    console.log('User ID:', userId);

    // Extract data - handle both formats
    const channelId = payload.channelId;
    const content = payload.content;

    console.log('Extracted channelId:', channelId);
    console.log('Extracted content:', content);

    if (!channelId || !content) {
      console.error('❌ Missing required fields!');
      return { error: 'channelId and content are required' };
    }
    const isMember = await this.channelMembersRepo.findOne({
      where: { channelId, userId },
    });

    if (!isMember) {
      throw new ForbiddenException('User not in channel');
    }


    try {
      const message = await this.messagesService.sendMessage(
        channelId,
        userId,
        content,
      );
      console.log('✅ Message sent successfully:', message.id);
      return { success: true, messageId: message.id };
    } catch (error) {
      console.error('❌ Error:', error.message);
      return { error: error.message };
    }
  }

  // 🔁 Redis → WebSocket fan-out
  @OnEvent(REDIS_CHANNELS.MESSAGE_CREATED)
  handleMessageFromRedis(payload: any) {
    console.log('📡 Broadcasting to channel:', payload.channelId);
    this.server
      .to(payload.channelId)
      .emit('receive_message', payload.message);
  }
}