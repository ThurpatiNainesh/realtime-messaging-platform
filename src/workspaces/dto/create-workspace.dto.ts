import { IsString, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(1, { message: 'Workspace name cannot be empty' })
  name: string;
}