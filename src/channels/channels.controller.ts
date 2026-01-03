import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Post()
  async createChannel(@Body() dto: CreateChannelDto, @Req() req) {
    return this.channelsService.createChannel(dto, req.user.userId);
  }

  @Get()
  async getChannels(@Query('workspaceId') workspaceId: string, @Req() req) {
    return this.channelsService.getChannelsByWorkspace(
      workspaceId,
      req.user.userId,
    );
  }
}
