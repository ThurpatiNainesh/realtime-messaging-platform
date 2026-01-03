import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PresenceGateway } from './presence.gateway';
import { MessagesModule } from '../messages/messages.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MessagesModule, JwtModule.register({})],
  providers: [ChatGateway, PresenceGateway],
})
export class RealtimeModule {}
