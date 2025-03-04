import {Controller, Get, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import {EmailQueryDto} from "@/email/dto/email-query.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";


@ApiTags('验证码模块')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}


  @Get('register')
  @ApiOperation({ summary: '用户注册验证码' })
  @UsePipes(new ValidationPipe({transform: true}))
  async register(@Query() data: EmailQueryDto) {
    return  await this.captchaService.userRegister(data);
  }

  @Get('update_pwd')
  @ApiOperation({ summary: '用户修改密码验证码'  })
  @UsePipes(new ValidationPipe({transform: true}))
  async updatePassword(@Query() data: EmailQueryDto) {
    return await this.captchaService.userUpdatePwd(data);
  }

  @Get('update_user_info')
  @ApiOperation({ summary: '用户修改信息验证码' })
  @UsePipes(new ValidationPipe({transform: true}))
  async updateUserInfo(@Query() data: EmailQueryDto) {
    return await this.captchaService.userUpdateInfo(data);
  }
}
