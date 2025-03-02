import {Inject, Injectable} from '@nestjs/common';
import {createTransport, Transporter} from 'nodemailer'
import {ConfigService} from "@nestjs/config";
import {NodemailerConfigKey} from "@/common/enum.common";

@Injectable()
export class EmailService {

    private readonly transporter: Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = createTransport({
            host: this.configService.get(NodemailerConfigKey.host),
            port: +this.configService.get(NodemailerConfigKey.port),
            secure: false,
            auth: {
                user: this.configService.get(NodemailerConfigKey.auth_user),
                pass: this.configService.get(NodemailerConfigKey.auth_pass),
            }
        })
    }

    async sendEmail({to, subject, html}) {
        await this.transporter.sendMail({
            from: {
                name: '林间有风会议室预约系统',
                address: this.configService.get(NodemailerConfigKey.auth_user),
            },
            to, subject, html
        })
    }
}
