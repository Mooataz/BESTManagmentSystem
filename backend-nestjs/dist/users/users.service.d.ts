import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';
export declare class UsersService {
    private readonly userRepositry;
    private readonly permissionRepositry;
    private readonly branchRepositry;
    private appService;
    constructor(userRepositry: Repository<User>, permissionRepositry: Repository<Permission>, branchRepositry: Repository<Branch>, appService: AppService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<User>;
    findByBranchId(branchId: number): Promise<User[]>;
    findByStatus(status: string): Promise<User[]>;
    findUserByLogin(login: string): Promise<User>;
    findToAssign(branchId: number, admin: boolean): Promise<User[]>;
    getUsersByRole(role: string): Promise<User[]>;
    getAllUsersSortedByRole(): Promise<User[]>;
}
