import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Message } from '../entities/message.entity';
import { ChannelMember } from '../entities/channel-member.entity';
import { RedisPublisher } from '../redis/redis.publisher';
import { REDIS_CHANNELS } from '../redis/redis.constants';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(ChannelMember)
    private channelMemberRepo: Repository<ChannelMember>,
    private redisPublisher: RedisPublisher,
  ) {}

  async assertUserInChannel(channelId: string, userId: string) {
    const member = await this.channelMemberRepo.findOne({
      where: { channelId, userId },
    });
    if (!member) {
      throw new ForbiddenException('User not in channel');
    }
  }

  async sendMessage(
    channelId: string,
    senderId: string,
    content: string,
  ) {
    await this.assertUserInChannel(channelId, senderId);

    const message = this.messageRepo.create({
      channelId,
      senderId,
      content,
    });

    const savedMessage = await this.messageRepo.save(message);

    await this.redisPublisher.publish(
      REDIS_CHANNELS.MESSAGE_CREATED,
      {
        channelId,
        message: savedMessage,
      },
    );

    return savedMessage;
  }

  async getMessages(
    channelId: string,
    userId: string,
    limit = 20,
    cursor?: string,
  ) {
    await this.assertUserInChannel(channelId, userId);

    const where: any = { channelId };

    if (cursor) {
      const cursorMessage = await this.messageRepo.findOne({
        where: { id: cursor },
      });

      if (cursorMessage) {
        where.createdAt = LessThan(cursorMessage.createdAt);
      }
    }

    return this.messageRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
