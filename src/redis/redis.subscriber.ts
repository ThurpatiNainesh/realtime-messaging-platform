import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { REDIS_CHANNELS } from './redis.constants';

@Injectable()
export class RedisSubscriber implements OnModuleInit {
  constructor(
    private redisService: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    const subClient = this.redisService.getSubscriber();

    await subClient.subscribe(
      Object.values(REDIS_CHANNELS),
      (message, channel) => {
        const payload = JSON.parse(message);
        this.eventEmitter.emit(channel, payload);
      },
    );
  }
}
