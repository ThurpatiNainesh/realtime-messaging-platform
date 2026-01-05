import { Controller, Post, Body, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AddChannelMembersDto } from './dto/add-channel-members.dto';
import { ChannelMember } from '../entities/channel-member.entity';
import { ChannelsService } from '../channels/channels.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private channelsService: ChannelsService,
    @InjectRepository(ChannelMember)
    private memberRepo: Repository<ChannelMember>,
  ) { }

  @Post('login')
  async login(@Body() dto: LoginDto) {

    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }
  @Post('channels/:channelId/members')
  @UseGuards(JwtAuthGuard)
  async addChannelMembers(
    @Param('channelId') channelId: string,
    @Body() dto: AddChannelMembersDto,
    @CurrentUser() user: any,
  ) {
    return this.channelsService.addMembers(
      user.userId, // Accessing userId from the user object
      channelId,
      dto.userIds,
    );
  }
}
