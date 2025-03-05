import {
    Controller,
    Post,
    Body,
    Inject,
    Get,
    Query,
    UnauthorizedException,
    DefaultValuePipe,
} from '@nestjs/common';
import {UserService} from '@/user/user.service';
import {RegisterUserDto} from "@/user/dto/register-user.dto";
import {LoginUserDto} from "@/user/dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {RequireLogin, UserInfo} from "@/common/decorator/custom.decorator";
import {UpdateUserPasswordDto} from "@/user/dto/update-user-password.dto";
import {UpdateUserDto} from "@/user/dto/update-user.dto";
import {generateParseIntPipe} from "@/utils/custom-parse-pipe";
import {ApiQuery} from "@nestjs/swagger";

@Controller('user')
export class UserController {

    @Inject(UserService)
    private userService: UserService;

    @Inject(JwtService)
    private jwtService: JwtService;

    @Get('init')
    async initData() {
        return this.userService.initData();
    }

    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        return this.userService.register(dto);
    }

    @Post('login')
    async userLogin(@Body() dto: LoginUserDto) {
        return await this.userService.login(dto);
    }

    @Post('admin/Login')
    async adminLogin(@Body() dto: LoginUserDto) {
        return await this.userService.login(dto, true);
    }

    async verifyToken(token: string, isAdmin: boolean = false) {
        try {
            const data = this.jwtService.verify(token);
            const user = await this.userService.findUserByUid(data.uid, isAdmin);
            const accessToken = await this.userService.generateAccessToken(user);
            const refreshToken = await this.userService.generateRefreshToken(user);

            return {
                accessToken,
                refreshToken,
            }
        } catch (err) {
            throw new UnauthorizedException('token 已失效，请重新登录！')
        }

    }

    @Get('refresh')
    async refresh(@Query('token') token: string) {
        return this.verifyToken(token, false);
    }

    @Get('admin/refresh')
    async adminRefresh(@Query('token') token: string) {
        return this.verifyToken(token, true);
    }

    @Get('info')
    @RequireLogin()
    async info(@UserInfo('uid') uid: number) {
        return await this.userService.findUserDetailByUid(uid);
    }

    @Post('update_pwd')
    @RequireLogin()
    async updatePassword(@UserInfo('uid') uid: number, @Body() dto: UpdateUserPasswordDto) {
        return await this.userService.updatePassword(uid, dto);
    }

    @Post('update')
    @RequireLogin()
    async update(@UserInfo('uid') uid: number, @Body() dto: UpdateUserDto) {
        return await this.userService.update(uid, dto);
    }

    @Post('freeze')
    @RequireLogin()
    async freeze(@Query('id') id: number) {
        return await this.userService.freeze(id);
    }


    @ApiQuery({
        name: 'pageNo',
        type: 'number',
        description: '页码',
        required: true,
        example: 1
    })
    @ApiQuery({
        name: 'pageSize',
        type: 'number',
        description: '数据条数',
        required: true,
        example: 10
    })
    @Get('list')
    async list(
        @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
        @Query('pageSize', new DefaultValuePipe(10), generateParseIntPipe('pageSize')) pageSize: number,
        @Query('username') username: string,
        @Query('nickName') nickName: string,
        @Query('email') email: string
    ) {
        return await this.userService.findUserByPage({username, nickName, email}, {pageNo, pageSize});
    }
}
