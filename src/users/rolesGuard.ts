import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './rolesDecorator';
import { UserRole } from './user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);
    if (!requiredRoles) {
        return true;
    }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
    }

        const token = authHeader.split(' ')[1];
        try {
            const user = this.jwtService.verify(token);
            request.user = user;

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Forbidden resource');
        }

        return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
