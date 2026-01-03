import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  async onModuleInit() {
    this.pubClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.subClient = this.pubClient.duplicate();

    await this.pubClient.connect();
    await this.subClient.connect();
  }

  getPublisher() {
    return this.pubClient;
  }

  getSubscriber() {
    return this.subClient;
  }

  async onModuleDestroy() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }
}
