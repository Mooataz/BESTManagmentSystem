import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    getByStatus(status: string, res: any): Promise<any>;
    getUserByLogin(login: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateUserDto: UpdateUserDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getByRole(role: string): Promise<import("./entities/user.entity").User[]>;
    getAllSorted(): Promise<import("./entities/user.entity").User[]>;
}
