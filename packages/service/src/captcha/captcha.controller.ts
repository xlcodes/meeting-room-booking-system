import {Controller, Get, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import {EmailQueryDto} from "@/email/dto/email-query.dto";

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}


  @Get('register')
  @UsePipes(new ValidationPipe({transform: true}))
  async register(@Query() data: EmailQueryDto) {
    return  await this.captchaService.userRegister(data);
  }
}
