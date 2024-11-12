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
    ) {
        console.log('ChatGateway initialized');
    }
  
    async handleConnection(client: Socket) {
        console.log('New client attempting to connect:', client.id);
        try {
            const token = client.handshake.auth.token;
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
    async handleMessage(client: Socket, payload: { chatId: string; content: string }) {
        console.log('Received message payload:', payload);
        console.log('From client:', client.id);
        
        try {
            const token = client.handshake.auth.token;
            console.log('Token from message sender:', token);
            
            const decoded = this.jwtService.verify(token);
            console.log('Decoded sender info:', decoded);
            
            const message = await this.chatService.createMessage({
                content: payload.content,
                chatId: payload.chatId,
                senderId: decoded.id,
            });
            console.log('Created message:', message);
    
            const chat = await this.chatService.getChatById(payload.chatId);
            console.log('Retrieved chat:', chat);
            console.log('Participants to notify:', chat.participants);
            
            // Emit to all participants in the chat
            chat.participants.forEach((participantId) => {
                const socketId = this.connectedUsers.get(participantId);
                console.log(`Participant ${participantId} socket:`, socketId);
                
                if (socketId) {
                    this.server.to(socketId).emit('new_message', message);
                    console.log(`Message emitted to socket ${socketId}`);
                } else {
                    console.log(`Participant ${participantId} not connected`);
                }
            });
        } catch (err) {
            console.error('Error in handleMessage:', err);
            client.emit('error', { message: 'Failed to send message' });
        }
        
    }
  
    @SubscribeMessage('join_chat')
    async handleJoinChat(client: Socket, payload: { chatId: string }) {
        console.log(`Client ${client.id} attempting to join chat:`, payload.chatId);
        
        try {
            const chat = await this.chatService.getChatById(payload.chatId);
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