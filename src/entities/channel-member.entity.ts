import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity('channel_members')
@Unique(['channelId', 'userId'])
export class ChannelMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Channel, (channel) => channel.members, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @Column()
  channelId: string;

  @ManyToOne(() => User, (user) => user.channelMemberships, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  joinedAt: Date;
}
