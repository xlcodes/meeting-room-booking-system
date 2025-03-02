import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({
    name: 'sys_permissions',
})
export class PermissionEntity {
    @PrimaryGeneratedColumn({
        comment: '权限唯一标识'
    })
    pid: number;

    @Column({
        length: 20,
        comment: '权限代码'
    })
    code: string;

    @Column({
        length: 100,
        comment: "权限描述"
    })
    description: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}