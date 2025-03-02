import {Inject, Injectable, Logger} from '@nestjs/common';
import {RedisClientType} from "redis";
import {REDIS_CLIENT} from "@/common/constant.common";

@Injectable()
export class RedisService {
    private logger = new Logger(RedisService.name);

    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType;

    async get(key: string) {
        try {
            return await this.redisClient.get(key);
        } catch (e) {
            this.logger.error(e);
            return null;
        }
    }

    async set(key: string, value: string, ttl?: number) {
        try {
            if (ttl) {
                await this.redisClient.set(key, value, {EX: ttl});
            } else {
                await this.redisClient.set(key, value);
            }
            return true;
        } catch (e) {
            this.logger.error(e);
            return false;
        }
    }

    async del(key: string) {
        try {
            await this.redisClient.del(key);
            return true;
        } catch (e) {
            this.logger.error(e);
            return false;
        }
    }
}
