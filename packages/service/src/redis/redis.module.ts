import {Global, Module} from '@nestjs/common';
import {RedisService} from './redis.service';
import {REDIS_CLIENT} from "@/common/constant.common";
import {createClient} from "redis";
import {ConfigService} from "@nestjs/config";
import {RedisConfigKey} from "@/common/enum.common";


@Global()
@Module({
    providers: [RedisService, {
        provide: REDIS_CLIENT,
        useFactory: async (configService: ConfigService) => {
            const client = createClient({
                socket: {
                    host: configService.get<string>(RedisConfigKey.host),
                    port: Number(configService.get<number>(RedisConfigKey.port)),
                },
                database: Number(configService.get<number>(RedisConfigKey.database)),
            })
            await client.connect();
            return client;
        },
        inject: [ConfigService],
    }],
    exports: [RedisService],
})
export class RedisModule {
}
