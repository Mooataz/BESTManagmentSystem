import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(createPermissionDto: CreatePermissionDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updatePermissionDto: UpdatePermissionDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
