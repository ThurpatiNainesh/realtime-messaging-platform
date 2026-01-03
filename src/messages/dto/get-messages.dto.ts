export class GetMessagesDto {
  channelId: string;
  limit?: number;
  cursor?: string; // messageId
}
