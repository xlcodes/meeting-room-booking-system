import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from '@/user/user.module';
import {RedisModule} from '@/redis/redis.module';
import {EmailModule} from '@/email/email.module';
import {CaptchaModule} from '@/captcha/captcha.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MysqlConfigKey} from "@/common/enum.common";

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
        UserModule,
        RedisModule,
        EmailModule,
        CaptchaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
