import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
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
    ) {
        console.log('ChatGateway initialized');
    }

    async handleConnection(client: Socket) {
        console.log('New client attempting to connect:', client.id);
        try {
            // Lấy token từ headers
            const authHeader = client.handshake.headers.authorization;
            if (!authHeader) {
                throw new Error('No authorization header');
            }

            const token = authHeader.split(' ')[1];
            console.log('Received token:', token);

            const decoded = this.jwtService.verify(token);
            console.log('Decoded token:', decoded);

            this.connectedUsers.set(decoded.id, client.id);
            console.log('Connected users after new connection:', [...this.connectedUsers.entries()]);

            client.emit('connection_success', { message: 'Successfully connected' });
            console.log(`Client ${client.id} successfully connected for user ${decoded.id}`);
        } catch (error) {
            console.error('Connection failed. JWT verification error:', error);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnecting:', client.id);

        const userId = this.findUserIdBySocketId(client.id);
        if (userId) {
            console.log(`User ${userId} disconnected`);
            this.connectedUsers.delete(userId);
            console.log('Connected users after disconnection:', [...this.connectedUsers.entries()]);
        } else {
            console.log('No user found for disconnecting socket');
        }
    }

    @SubscribeMessage('send_message')
    async handleMessage(client: Socket, payload: { data?: { chatId: string; content: string } }) {
        console.log('Received message payload:', JSON.stringify(payload, null, 2)); // Log chi tiết của payload
        console.log('From client:', client.id);

        try {
            const authHeader = client.handshake.headers.authorization;
            if (!authHeader) {
                throw new Error('No authorization header');
            }
            const token = authHeader.split(' ')[1];
            console.log('Token from message sender:', token);

            const decoded = this.jwtService.verify(token);
            console.log('Decoded sender info:', decoded);

            // Kiểm tra payload.data và các thuộc tính bên trong
            if (!payload.data) {
                throw new Error('Payload data is missing');
            }
            if (!payload.data.chatId) {
                throw new Error('Payload data is missing chatId');
            }
            if (!payload.data.content) {
                throw new Error('Payload data is missing content');
            }

            const message = await this.chatService.createMessage({
                content: payload.data.content,
                chatId: payload.data.chatId,
                senderId: decoded.id,
            });
            console.log('Created message:', message);

            const chat = await this.chatService.getChatById(payload.data.chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }

            console.log('Retrieved chat:', chat);
            console.log('Participants to notify:', chat.participants);

            // Gửi tin nhắn tới tất cả các thành viên trong chat
            chat.participants.forEach((participantId) => {
                const socketId = this.connectedUsers.get(participantId);
                console.log(`Participant ${participantId} socket:`, socketId);

                if (socketId) {
                    this.server.to(socketId).emit('new_message', {
                        message: message,
                        chatId: payload.data.chatId,
                    });
                    console.log(`Message emitted to socket ${socketId}`);
                } else {
                    console.log(`Participant ${participantId} not connected`);
                }
            });

            // Gửi phản hồi thành công về cho người gửi
            client.emit('message_sent', {
                success: true,
                message: message,
            });

        } catch (err) {
            console.error('Error in handleMessage:', err.message);
            client.emit('error', { 
                success: false,
                message: err.message || 'Failed to send message',
            });
        }
    }

    @SubscribeMessage('join_chat')
    async handleJoinChat(client: Socket, payload: { chatId: string }) {
        console.log(`Client ${client.id} attempting to join chat:`, payload.chatId);

        try {
            const chat = await this.chatService.getChatById(payload.chatId);
            if (!chat) {
                throw new Error('Chat not found');
            }
            
            console.log('Retrieved chat for joining:', chat);

            client.join(chat.id);
            console.log(`Client ${client.id} joined chat ${chat.id}`);

            // Emit success event back to client
            client.emit('joined_chat', { chatId: chat.id });
        } catch (error) {
            console.error('Error joining chat:', error);
            client.emit('error', { message: 'Failed to join chat' });
        }
    }

    private findUserIdBySocketId(socketId: string): string | undefined {
        console.log('Searching for user with socket ID:', socketId);

        for (const [userId, connectedSocketId] of this.connectedUsers.entries()) {
            if (connectedSocketId === socketId) {
                console.log('Found user:', userId);
                return userId;
            }
        }
        console.log('No user found for socket ID');
        return undefined;
    }
}
