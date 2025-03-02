import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserEntity} from "@/user/entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CaptchaModule} from "@/captcha/captcha.module";
import {RoleEntity} from "@/user/entities/role.entity";
import {PermissionEntity} from "@/user/entities/permission.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {
}
