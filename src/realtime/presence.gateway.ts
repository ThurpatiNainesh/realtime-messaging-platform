import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket) {
    // mark user online in Redis (future)
  }

  handleDisconnect(client: Socket) {
    // mark user offline in Redis (future)
  }
}
