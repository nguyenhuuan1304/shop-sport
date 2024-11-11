import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
    
@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  
    constructor(
        private readonly jwtService: JwtService,
        private readonly chatService: ChatService,
    ) {}
  
    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            const decoded = this.jwtService.verify(token);
            this.connectedUsers.set(decoded.id, client.id);
            client.emit('connection_success', { message: 'Successfully connected' });
        } catch (error) {
            console.error('JWT verification failed:', error);
            client.disconnect();
        }
    }
  
    handleDisconnect(client: Socket) {
        const userId = this.findUserIdBySocketId(client.id);
        if (userId) {
            this.connectedUsers.delete(userId);
        }
    }
  
    @SubscribeMessage('send_message')
    async handleMessage(client: Socket, payload: { chatId: string; content: string }) {
        try {
            const token = client.handshake.auth.token;
            const decoded = this.jwtService.verify(token);
            
            const message = await this.chatService.createMessage({
                content: payload.content,
                chatId: payload.chatId,
                senderId: decoded.id,
            });
    
            const chat = await this.chatService.getChatById(payload.chatId);
            
            // Emit to all participants in the chat
            chat.participants.forEach((participantId) => {
                const socketId = this.connectedUsers.get(participantId);
                if (socketId) {
                    this.server.to(socketId).emit('new_message', message);
                }
            });
        } catch (err) {
            console.error('Error while sending message:', err);
            client.emit('error', { message: 'Failed to send message' });
        }
    }
  
    @SubscribeMessage('join_chat')
    async handleJoinChat(client: Socket, payload: { chatId: string }) {
        const chat = await this.chatService.getChatById(payload.chatId);
        client.join(chat.id);
    }
  
    private findUserIdBySocketId(socketId: string): string | undefined {
        for (const [userId, connectedSocketId] of this.connectedUsers.entries()) {
            if (connectedSocketId === socketId) {
                return userId;
            }
        }
        return undefined;
    }
}