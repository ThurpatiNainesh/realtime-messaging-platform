import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RedisPublisher {
  constructor(private redisService: RedisService) {}

  async publish(channel: string, payload: any) {
    const client = this.redisService.getPublisher();
    await client.publish(channel, JSON.stringify(payload));
  }
}
