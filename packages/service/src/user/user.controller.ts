import {
    Controller,
    Post,
    Body, Inject,
} from '@nestjs/common';
import {UserService} from '@/user/user.service';
import {RegisterUserDto} from "@/user/dto/register-user.dto";

@Controller('user')
export class UserController {

    @Inject(UserService)
    private userService: UserService;
    
    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        return this.userService.register(dto);
    }
}
