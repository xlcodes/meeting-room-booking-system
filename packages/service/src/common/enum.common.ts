
export enum CAPTCHA_TYPE {
    REGISTER = 'captcha_register',
    LOGIN = 'captcha_login',
    UPDATE_PWD = 'captcha_update_pwd',
    UPDATE_USER = 'captcha_update_user',
}

export const CAPTCHA_TYPE_TEXT = {
    [CAPTCHA_TYPE.REGISTER]: '注册',
    [CAPTCHA_TYPE.LOGIN]: '登录',
    [CAPTCHA_TYPE.UPDATE_PWD]: '修改密码',
    [CAPTCHA_TYPE.UPDATE_USER]: '修改用户信息',
}

export enum ApplicationConfigKey {
    port = 'application_port'
}

export enum RedisConfigKey {
    host = 'redis_server_host',
    port = 'redis_server_port',
    database = 'redis_server_db',
}

export enum MysqlConfigKey {
    host = 'mysql_server_host',
    port = 'mysql_server_port',
    username = 'mysql_server_username',
    password = 'mysql_server_password',
    database = 'mysql_server_database',
}

export enum NodemailerConfigKey {
    host ='nodemailer_host',
    port ='nodemailer_port',
    auth_user ='nodemailer_auth_user',
    auth_pass = 'nodemailer_auth_pass',
}

export enum JwtConfigKey {
    secret = 'jwt_secret',
    expiresIn = 'jwt_expires_in',
    accessTokenExpiresIn = 'jwt_access_token_expires_in',
    refreshTokenExpiresIn = 'jwt_refresh_token_expires_in',
}