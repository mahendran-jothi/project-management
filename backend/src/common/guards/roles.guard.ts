import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(ctx: ExecutionContext): boolean {
        const roles = this.reflector.get<Role[]>('roles', ctx.getHandler());
        if (!roles) return true;
        const user = ctx.switchToHttp().getRequest().user;
        return roles.includes(user.role);
    }
}
