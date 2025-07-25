import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private socketRoles = new Map<string, string>();

    constructor(
        private readonly configService: ConfigService,
        private readonly notificationsService: NotificationsService
    ) { }

    async handleConnection(client: Socket) {
        const token = client.handshake.auth?.token;

        try {
            const jwtSecret = this.configService.get<string>('secret');
            if (!jwtSecret) {
                throw new Error('secret not defined in config');
            }

            const decoded: any = jwt.verify(token, jwtSecret);
            const role = (decoded.role || '').trim();

            this.socketRoles.set(client.id, role);
        } catch (error) {
            console.error('JWT verification failed:', error.message);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        this.socketRoles.delete(client.id);
    }

    notifyViewers(event: string, data: any) {
        for (const [socketId, role] of this.socketRoles.entries()) {
            if (role === 'Viewer') {
                this.server.to(socketId).emit(event, data);
                this.notificationsService.create(data.projectId, data.message);
            }
        }
    }

}
