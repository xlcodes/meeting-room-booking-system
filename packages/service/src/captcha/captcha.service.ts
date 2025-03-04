import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {EmailQueryDto} from "@/email/dto/email-query.dto";
import {EmailService} from "@/email/email.service";
import {RedisService} from "@/redis/redis.service";
import {CAPTCHA_TYPE, CAPTCHA_TYPE_TEXT} from "@/common/enum.common";

@Injectable()
export class CaptchaService {

    @Inject(EmailService)
    private emailService: EmailService;

    @Inject(RedisService)
    private redisService: RedisService;

    /**
     * 校验验证码
     * @param key 验证码标识
     * @param value 需要验证的验证码
     * @throws BadRequestException 验证码不存在或已失效
     * @return true 验证通过
     */
    async checkCaptcha(key: string, value: string) {
        const captcha = await this.redisService.get(key)

        if (!captcha || (captcha !== value)) {
            throw new BadRequestException("验证码不存在或已失效");
        }

        await this.redisService.del(key)

        return true
    }

    async sendCaptcha(email: string, type: CAPTCHA_TYPE) {
        const code = Math.random().toString().slice(2, 8);
        const redisCode = await this.redisService.get(`${type}_${email}`);
        if (redisCode) {
            return '验证码已发送！';
        }

        await this.redisService.set(`${type}_${email}`, code, 5 * 60);

        await this.emailService.sendEmail({
            to: email,
            subject: `${CAPTCHA_TYPE_TEXT[type]}验证码`,
            html: `<p>您的${CAPTCHA_TYPE_TEXT[type]}验证码为：${code}，有效期5分钟！</p>`,
        });
        return '发送成功！';
    }

    /**
     * 用户注册验证码
     * @param data.email 用户注册邮箱
     * @return '发送成功！' | '验证码已发送！'
     */
    async userRegister(data: EmailQueryDto) {
        return await this.sendCaptcha(data.email, CAPTCHA_TYPE.REGISTER);
    }

    /**
     * 用户修改密码验证码
     * @param data.email 用户邮箱
     * @return '发送成功！' | '验证码已发送！'
     */
    async userUpdatePwd(data: EmailQueryDto) {
        return await this.sendCaptcha(data.email, CAPTCHA_TYPE.UPDATE_PWD);
    }

    /**
     * 用户信息修改验证码
     * @param data.email 用户邮箱
     * @return '发送成功！' | '验证码已发送！'
     */
    async userUpdateInfo(data: EmailQueryDto) {
        return await this.sendCaptcha(data.email, CAPTCHA_TYPE.UPDATE_USER);
    }
}
