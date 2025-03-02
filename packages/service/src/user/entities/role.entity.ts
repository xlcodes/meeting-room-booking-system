import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PermissionEntity} from "@/user/entities/permission.entity";

@Entity({
    name: 'sys_roles'
})
export class RoleEntity {
    @PrimaryGeneratedColumn({comment: "角色唯一ID"})
    rid: number;

    @Column({length: 20, comment: "角色名称"})
    name: string;

    @ManyToMany(() => PermissionEntity)
    @JoinTable({
        name: "role_permissions",
    })
    permissions: PermissionEntity[];

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}