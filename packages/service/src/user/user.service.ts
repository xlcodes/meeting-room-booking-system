import {BadRequestException, Inject, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "@/user/entities/user.entity";
import {RegisterUserDto} from "@/user/dto/register-user.dto";
import {RedisService} from "@/redis/redis.service";
import {CAPTCHA_TYPE} from "@/common/enum.common";
import {md5} from "@/utils/md5";
import {CaptchaService} from "@/captcha/captcha.service";

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(CaptchaService)
    private captchaService: CaptchaService;

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>;



    async findUserByUsername(username: string) {
        try {
            return await this.userRepository.findOneBy({
                username
            })
        } catch (err) {
            this.logger.error(err, UserService.name);
            return null;
        }
    }

    async register(dto: RegisterUserDto) {
        // 验证校验码
        await this.captchaService.checkCaptcha(`${CAPTCHA_TYPE.REGISTER}_${dto.email}`, dto.captcha);
        // 验证用户名是否已存在
        const user = await this.findUserByUsername(dto.username);

        if (user) {
            throw new BadRequestException("用户名已存在");
        }

        const newUser = new UserEntity();
        newUser.username = dto.username;
        newUser.password = md5(dto.password);
        newUser.email = dto.email;
        newUser.nickName = dto.nickName;

        try {
            await this.userRepository.save(newUser);
            return '注册成功'
        } catch (err) {
            this.logger.error(err, UserService.name);
            return '注册失败';
        }
    }
}
