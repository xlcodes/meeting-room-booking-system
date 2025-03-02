import {Controller, Get} from "@nestjs/common";
import {RequireLogin, RequirePermission, UserInfo} from "@/common/decorator/custom.decorator";

@Controller()
export class AppController {

    @Get('ccc')
    @RequireLogin()
    ccc() {
        return 'ccc';
    }

    @Get('ddd')
    @RequireLogin()
    @RequirePermission('ddd')
    ddd(@UserInfo() info: any, @UserInfo('username') username: string) {
        return 'ddd';
    }
}