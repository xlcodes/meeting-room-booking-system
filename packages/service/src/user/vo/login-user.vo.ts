
export class UserInfoVo {
    uid: number
    username: string;
    nickname: string;
    email: string;
    avatar: string;
    phoneNumber: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    roles: string[];
    permissions: string[];
}

export class LoginUserVo {
    userInfo: UserInfoVo;
    accessToken: string;
    refreshToken: string;
}