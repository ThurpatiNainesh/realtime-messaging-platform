import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';

@Entity('read_receipts')
@Unique(['userId', 'channelId'])
export class ReadReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.readReceipts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Channel, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Column()
  channelId: string;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'lastReadMessageId' })
  lastReadMessage: Message;

  @Column()
  lastReadMessageId: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
