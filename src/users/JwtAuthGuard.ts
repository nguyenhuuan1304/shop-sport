import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean { 
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error); 
      throw new UnauthorizedException();
    }
  }
}
