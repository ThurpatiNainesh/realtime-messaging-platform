import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity';
import { WorkspaceMember } from '../entities/workspace-member.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepo: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private memberRepo: Repository<WorkspaceMember>,
  ) {}

  async createWorkspace(name: string, ownerId: string) {
    const workspace = this.workspaceRepo.create({
      name,
      ownerId,
    });

    const savedWorkspace = await this.workspaceRepo.save(workspace);

    const ownerMembership = this.memberRepo.create({
      workspaceId: savedWorkspace.id,
      userId: ownerId,
      role: 'admin',
    });

    await this.memberRepo.save(ownerMembership);

    return savedWorkspace;
  }

  async isUserInWorkspace(workspaceId: string, userId: string) {
    return this.memberRepo.findOne({
      where: { workspaceId, userId },
    });
  }

  async assertUserInWorkspace(workspaceId: string, userId: string) {
    const member = await this.isUserInWorkspace(workspaceId, userId);
    if (!member) {
      throw new ForbiddenException('User not in workspace');
    }
  }
}
