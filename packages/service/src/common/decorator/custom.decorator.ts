import {Request} from 'express';
import {createParamDecorator, ExecutionContext, SetMetadata} from "@nestjs/common";
import {REQUIRE_LOGIN, REQUIRE_PERMISSION} from "@/common/constant.common";

export const RequireLogin = () => SetMetadata(REQUIRE_LOGIN, true);

export const RequirePermission = (...permissions: string[]) => SetMetadata(REQUIRE_PERMISSION, permissions);

export const UserInfo = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
        return null;
    }

    return key ? request.user[key] : request.user;
})