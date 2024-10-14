import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './rolesDecorator';
import { UserRole } from './user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        // Nếu không có yêu cầu quyền, cho phép truy cập
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        //console.log('User in RolesGuard:', user);

        // Kiểm tra người dùng có tồn tại không
        if (!user || !user.role) {
            throw new ForbiddenException('Forbidden resource: User not found or role is missing');
        }

        // Kiểm tra quyền của người dùng
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Forbidden resource: Insufficient role');
        }

        return true;
    }
}
