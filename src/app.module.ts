import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Modules */
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RedisModule } from './redis/redis.module';

/* Entities */
import { User } from './entities/user.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { Message } from './entities/message.entity';
import { ReadReceipt } from './entities/read-receipt.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'realtime_messaging'),
        entities: [
          User,
          Workspace,
          WorkspaceMember,
          Channel,
          ChannelMember,
          Message,
          ReadReceipt,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production', // Disable in production
      }),
    }),

    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    MessagesModule,
    RedisModule,
    RealtimeModule,
  ],
})
export class AppModule {}
