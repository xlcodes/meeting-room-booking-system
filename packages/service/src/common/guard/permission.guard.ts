import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Request} from 'express'
import {Reflector} from "@nestjs/core";
import {REQUIRE_PERMISSION} from "@/common/constant.common";

@Injectable()
export class PermissionGuard implements CanActivate {
    @Inject(Reflector)
    private reflector: Reflector;


    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        if (!request.user) {
            return true;
        }

        const permissions = request.user.permissions;

        const requirePermissions = this.reflector.getAllAndOverride(REQUIRE_PERMISSION, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requirePermissions) {
            return true;
        }

        for (let i = 0; i < requirePermissions.length; i++) {
            const current = requirePermissions[i];
            const found = permissions.find((item) => item.code === current);
            if(!found) {
                throw new UnauthorizedException('您没有访问该接口的权限！')
            }
        }

        return true;
    }
}
