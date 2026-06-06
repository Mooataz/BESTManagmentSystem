import { Branch } from "src/branches/entities/branch.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Notification{
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    title?: string;

    @Column()
    body?: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => User, (user) => user.notification, { nullable: true })
    user?: User;

    @ManyToOne(() => Branch, (branch) => branch.notification, { nullable: true })
    branch?: Branch;
}