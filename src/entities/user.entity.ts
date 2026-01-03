import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { WorkspaceMember } from './workspace-member.entity';
import { ChannelMember } from './channel-member.entity';
import { Message } from './message.entity';
import { ReadReceipt } from './read-receipt.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => WorkspaceMember, (wm) => wm.user)
  workspaceMemberships: WorkspaceMember[];

  @OneToMany(() => ChannelMember, (cm) => cm.user)
  channelMemberships: ChannelMember[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => ReadReceipt, (rr) => rr.user)
  readReceipts: ReadReceipt[];
}
