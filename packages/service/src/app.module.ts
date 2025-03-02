import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from '@/user/user.module';
import {RedisModule} from '@/redis/redis.module';
import {EmailModule} from '@/email/email.module';
import {CaptchaModule} from '@/captcha/captcha.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtConfigKey, MysqlConfigKey} from "@/common/enum.common";
import {JwtModule} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {LoginGuard} from "@/common/guard/login.guard";
import {AppController} from "@/app.controller";
import {PermissionGuard} from "@/common/guard/permission.guard";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get(MysqlConfigKey.host),
                port: +configService.get(MysqlConfigKey.port),
                username: configService.get(MysqlConfigKey.username),
                password: configService.get(MysqlConfigKey.password),
                database: configService.get(MysqlConfigKey.database),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: false,
                poolSize: 10,
                connectorPackage: 'mysql2'
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'src/.env',
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get(JwtConfigKey.secret),
                signOptions: {
                    expiresIn: configService.get(JwtConfigKey.expiresIn),
                },
            }),
            inject: [ConfigService],
        }),
        UserModule,
        RedisModule,
        EmailModule,
        CaptchaModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: LoginGuard,
        }, {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        }
    ],
})
export class AppModule {
}
