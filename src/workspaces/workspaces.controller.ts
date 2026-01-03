import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  async createWorkspace(@Body() dto: CreateWorkspaceDto, @Req() req) {
    return this.workspacesService.createWorkspace(dto.name, req.user.userId);
  }
}
