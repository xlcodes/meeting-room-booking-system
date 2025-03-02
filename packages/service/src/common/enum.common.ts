
export enum CAPTCHA_TYPE {
    REGISTER = 'captcha_register',
    LOGIN = 'captcha_login',
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