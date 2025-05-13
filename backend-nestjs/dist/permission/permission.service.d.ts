import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
export declare class PermissionService {
    private readonly permissionRepositry;
    constructor(permissionRepositry: Repository<Permission>);
    create(createPermissionDto: CreatePermissionDto): Promise<Permission>;
    findAll(): Promise<Permission[]>;
    findOne(id: number): Promise<Permission>;
    update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission>;
    remove(id: number): Promise<Permission>;
}
