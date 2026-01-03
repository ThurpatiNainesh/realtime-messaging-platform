import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Query('channelId') channelId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Req() req,
  ) {
    return this.messagesService.getMessages(
      channelId,
      req.user.userId,
      Number(limit) || 20,
      cursor,
    );
  }
}
