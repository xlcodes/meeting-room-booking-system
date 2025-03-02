import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RoleEntity} from "@/user/entities/role.entity";

@Entity({
    name: 'sys_users'
})
export class UserEntity {

    @PrimaryGeneratedColumn({comment: "用户唯一ID"})
    uid: number;

    @Column({length: 50, comment: "用户名"})
    username: string;

    @Column({length: 50, comment: "用户密码"})
    password: string;

    @Column({length: 50, name: 'nick_name', comment: '用户昵称'})
    nickName: string;

    @Column({
        comment: '邮箱',
        length: 50
    })
    email: string;

    @Column({length: 50, comment: "用户邮箱", nullable: true})
    phone: string;

    @Column({length: 100, comment: "用户头像", nullable: true})
    avatar: string;

    @Column({
        name: 'phone_number',
        comment: '手机号',
        length: 20,
        nullable: true
    })
    phoneNumber: string;

    @Column({
        name: 'is_frozen',
        comment: '是否被冻结',
        default: false
    })
    isFrozen: boolean;

    @Column({
        name: 'is_admin',
        comment: '是否是管理员',
        default: false
    })
    isAdmin: boolean;

    @ManyToMany(() => RoleEntity)
    @JoinTable({
        name: 'user_roles',
    })
    roles: RoleEntity[];

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}

