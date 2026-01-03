import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisService } from './redis.service';
import { RedisPublisher } from './redis.publisher';
import { RedisSubscriber } from './redis.subscriber';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [RedisService, RedisPublisher, RedisSubscriber],
  exports: [RedisPublisher],
})
export class RedisModule {}
