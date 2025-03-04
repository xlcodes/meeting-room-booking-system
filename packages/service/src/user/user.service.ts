import {BadRequestException, Inject, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "@/user/entities/user.entity";
import {RegisterUserDto} from "@/user/dto/register-user.dto";
import {RedisService} from "@/redis/redis.service";
import {CAPTCHA_TYPE, JwtConfigKey} from "@/common/enum.common";
import {md5} from "@/utils/md5";
import {CaptchaService} from "@/captcha/captcha.service";
import {LoginUserDto} from "@/user/dto/login-user.dto";
import {LoginUserVo} from "@/user/vo/login-user.vo";
import {RoleEntity} from "@/user/entities/role.entity";
import {PermissionEntity} from "@/user/entities/permission.entity";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {timeTextToSecond} from "@/utils/time";
import {UserInfoVo} from "@/user/vo/info-user.vo";
import {UpdateUserPasswordDto} from "@/user/dto/update-user-password.dto";
import {UpdateUserDto} from "@/user/dto/update-user.dto";

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);

    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(JwtService)
    private jwtService: JwtService;

    @Inject(ConfigService)
    private configService: ConfigService;

    @Inject(CaptchaService)
    private captchaService: CaptchaService;

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>;

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>;

    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>;

    async initData() {

        const user = await this.findUserByUsername('admin1');

        if (user) {
            throw new BadRequestException('初始化数据失败，数据已存在');
        }

        const u1 = new UserEntity();
        u1.username = 'admin1';
        u1.password = md5('123456');
        u1.email = 'admin1@qq.com';
        u1.isAdmin = true;
        u1.nickName = '张三';
        u1.phoneNumber = '13011112222';

        const u2 = new UserEntity();
        u2.username = 'user1';
        u2.password = md5('123456');
        u2.email = 'user1@qq.com';
        u2.isAdmin = false;
        u2.nickName = '李四';
        u2.phoneNumber = '13033334444';

        const r1 = new RoleEntity();
        r1.name = '管理员';
        const r2 = new RoleEntity();
        r2.name = '普通用户';

        const p1 = new PermissionEntity();
        p1.code = 'ccc';
        p1.description = 'c接口访问权限';
        const p2 = new PermissionEntity();
        p2.code = 'ddd';
        p2.description = 'd接口访问权限';

        u1.roles = [r1];
        u2.roles = [r2];

        r1.permissions = [p1, p2];
        r2.permissions = [p1];

        try {
            await this.permissionRepository.save([p1, p2]);
            await this.roleRepository.save([r1, r2]);
            await this.userRepository.save([u1, u2]);
            return '初始化数据成功';
        } catch (error) {
            this.logger.error(error, UserService.name);
            throw new BadRequestException('初始化数据失败');
        }
    }

    async generateAccessToken(user: LoginUserVo) {
        const token = this.jwtService.sign({
            uid: user.userInfo.uid,
            username: user.userInfo.username,
            roles: user.userInfo.roles,
            permissions: user.userInfo.permissions,
        }, {
            expiresIn: this.configService.get(JwtConfigKey.accessTokenExpiresIn),
        })
        this.logger.debug(`生成 ${user.userInfo.username} 的 accessToken：${token}`, UserService.name)
        return token;
    }

    async generateRefreshToken(user: LoginUserVo) {
        const cacheTokenKey = `refresh_token_${user.userInfo.uid}`;
        // 从缓存获取 refreshToken
        const cacheToken = await this.redisService.get(cacheTokenKey);

        if (cacheToken) {
            this.logger.debug(`从缓存获取 ${user.userInfo.username} 的 refreshToken：${cacheToken}`, UserService.name)
            return cacheToken;
        }
        // 生成 refreshToken
        const token = this.jwtService.sign({
            uid: user.userInfo.uid,
            username: user.userInfo.username,
            roles: user.userInfo.roles,
            permissions: user.userInfo.permissions,
        }, {
            expiresIn: this.configService.get(JwtConfigKey.refreshTokenExpiresIn),
        })
        // refreshToken 有效期
        const ttl = +timeTextToSecond(this.configService.get(JwtConfigKey.refreshTokenExpiresIn));
        // 将 refreshToken 存在 redis 中，便于进行校验
        await this.redisService.set(cacheTokenKey, token, ttl);
        this.logger.debug(`生成 ${user.userInfo.username} 的 refreshToken：${token}`, UserService.name)
        return token;
    }

    async generateLoginUserVo(user: UserEntity, hasToken: boolean = false) {
        const vo = new LoginUserVo();

        vo.userInfo = {
            uid: user.uid,
            username: user.username,
            nickname: user.nickName,
            email: user.email,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin,
            createdAt: user.createAt,
            updatedAt: user.updateAt,
            deletedAt: user.deleteAt,
            roles: user.roles.map(role => role.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach(permission => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission)
                    }
                })
                return arr
            }, []),
        }

        if (hasToken) {
            vo.accessToken = await this.generateAccessToken(vo);
            vo.refreshToken = await this.generateRefreshToken(vo);
        }

        return vo;
    }

    async findUserByUid(uid: number, isAdmin: boolean = false) {
        const user = await this.userRepository.findOne({
            where: {
                uid,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions']
        })

        return await this.generateLoginUserVo(user);
    }

    async findUserDetailByUid(uid: number) {
        const user = await this.userRepository.findOne({
            where: {
                uid,
            },
            relations: ['roles', 'roles.permissions']
        });

        const vo = new UserInfoVo();

        ;['uid', 'username', 'nickName', 'email', 'avatar', 'phoneNumber', 'isAdmin', 'isFrozen', 'createAt', 'updateAt', 'deleteAt'].forEach(key => {
            vo[key] = user[key];
        })

        return vo;
    }

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

    async login(dto: LoginUserDto, isAdmin: boolean = false) {
        const user = await this.userRepository.findOne({
            where: {
                username: dto.username,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions']
        })

        if (!user || user.password !== md5(dto.password)) {
            throw new BadRequestException('用户不存在或用户密码错误');
        }

        return this.generateLoginUserVo(user, true);
    }

    async updatePassword(uid: number, dto: UpdateUserPasswordDto) {
        // 验证校验码
        await this.captchaService.checkCaptcha(`${CAPTCHA_TYPE.UPDATE_PWD}_${dto.email}`, dto.captcha);

        const foundUser = await this.userRepository.findOneBy({uid});

        if (!foundUser) {
            throw new BadRequestException('当前用户不存在');
        }

        foundUser.password = md5(dto.password);

        try {
            await this.userRepository.save(foundUser);
            return '修改密码成功';
        } catch (err) {
            this.logger.error(err, UserService.name);
            return '修改密码失败';
        }

    }

    async update(uid: number, dto: UpdateUserDto) {
        // 验证校验码
        await this.captchaService.checkCaptcha(`${CAPTCHA_TYPE.UPDATE_USER}_${dto.email}`, dto.captcha);

        const foundUser = await this.userRepository.findOneBy({uid});

        if(dto.nickName) {
            foundUser.nickName = dto.nickName;
        }

        if(dto.avatar) {
            foundUser.avatar = dto.avatar;
        }

        try {
            await this.userRepository.save(foundUser);
            return '修改用户信息成功';
        } catch (err) {
            this.logger.error(err, UserService.name);
            return '修改用户信息失败';
        }
    }
}
