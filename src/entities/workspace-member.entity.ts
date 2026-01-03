import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';

@Entity('workspace_members')
@Unique(['workspaceId', 'userId'])
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.members, {
    onDelete: 'CASCADE',
  })
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @ManyToOne(() => User, (user) => user.workspaceMemberships, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member';

  @CreateDateColumn()
  joinedAt: Date;
}
