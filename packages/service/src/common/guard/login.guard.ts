import {CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core'
import {PermissionEntity} from "@/user/entities/permission.entity";
import {JwtService} from "@nestjs/jwt";
import {Request} from 'express'
import {REQUIRE_LOGIN} from "@/common/constant.common";

interface JwtUserData {
    uid: number;
    username: string;
    roles: string[];
    permissions: PermissionEntity[];
}

declare module 'express' {
    interface Request {
        user: JwtUserData
    }
}

@Injectable()
export class LoginGuard implements CanActivate {

    private readonly logger = new Logger();

    @Inject()
    private reflector: Reflector;

    @Inject(JwtService)
    private jwtService: JwtService;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const requireLogin = this.reflector.getAllAndOverride(REQUIRE_LOGIN, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireLogin) {
            return true;
        }

        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('用户未登录！');
        }

        try {
            const token = authorization.split(' ')[1];
            const data = this.jwtService.verify(token);

            this.logger.log(`token 解析数据：${JSON.stringify(data)}`);

            request.user = {
                uid: data.uid,
                username: data.username,
                roles: data.roles,
                permissions: data.permissions,
            }
            return true;
        } catch (err) {
            throw new UnauthorizedException('token 失效，请重新登录！');
        }
    }
}
