import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { PresenceGateway } from './presence.gateway';
import { MessagesModule } from '../messages/messages.module';
import { ChannelMember } from '../entities/channel-member.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelMember]),
    MessagesModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    })
  ],
  providers: [ChatGateway, PresenceGateway],
  exports: [TypeOrmModule]
})
export class RealtimeModule {}
