import { OtherCostService } from './other-cost.service';
import { CreateOtherCostDto } from './dto/create-other-cost.dto';
import { UpdateOtherCostDto } from './dto/update-other-cost.dto';
export declare class OtherCostController {
    private readonly otherCostService;
    constructor(otherCostService: OtherCostService);
    create(createOtherCostDto: CreateOtherCostDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: string, updateOtherCostDto: UpdateOtherCostDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
