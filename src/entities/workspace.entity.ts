import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WorkspaceMember } from './workspace-member.entity';
import { Channel } from './channel.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => WorkspaceMember, (wm) => wm.workspace)
  members: WorkspaceMember[];

  @OneToMany(() => Channel, (channel) => channel.workspace)
  channels: Channel[];
}
