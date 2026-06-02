import { DistributeurService } from './distributeur.service';
import { CreateDistributeurDto } from './dto/create-distributeur.dto';
import { UpdateDistributeurDto } from './dto/update-distributeur.dto';
export declare class DistributeurController {
    private readonly distributeurService;
    constructor(distributeurService: DistributeurService);
    create(createDistributeurDto: CreateDistributeurDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateDistributeurDto: UpdateDistributeurDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
