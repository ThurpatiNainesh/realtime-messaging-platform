import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelMember } from '../entities/channel-member.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepo: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private memberRepo: Repository<ChannelMember>,
    private workspacesService: WorkspacesService,
  ) {}

  async createChannel(dto: CreateChannelDto, userId: string) {
    await this.workspacesService.assertUserInWorkspace(
      dto.workspaceId,
      userId,
    );

    const channel = this.channelRepo.create({
      workspaceId: dto.workspaceId,
      name: dto.name,
      isPrivate: dto.isPrivate ?? false,
    });

    const savedChannel = await this.channelRepo.save(channel);

    const member = this.memberRepo.create({
      channelId: savedChannel.id,
      userId,
    });

    await this.memberRepo.save(member);

    return savedChannel;
  }

  async getChannelsByWorkspace(workspaceId: string, userId: string) {
    await this.workspacesService.assertUserInWorkspace(workspaceId, userId);

    return this.channelRepo.find({
      where: { workspaceId },
    });
  }

  async assertUserInChannel(channelId: string, userId: string) {
    const member = await this.memberRepo.findOne({
      where: { channelId, userId },
    });

    if (!member) {
      throw new ForbiddenException('User not in channel');
    }
  }
}
