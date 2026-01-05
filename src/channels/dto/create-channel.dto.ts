import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateChannelDto {
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @IsString()
  @IsNotEmpty({ message: 'Channel name cannot be empty' })
  name: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}