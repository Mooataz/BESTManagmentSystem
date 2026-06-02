import { CreateOtherCostDto } from './dto/create-other-cost.dto';
import { UpdateOtherCostDto } from './dto/update-other-cost.dto';
import { OtherCost } from './entities/other-cost.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class OtherCostService {
    private readonly otherCostRepositry;
    private appService;
    constructor(otherCostRepositry: Repository<OtherCost>, appService: AppService);
    create(createOtherCostDto: CreateOtherCostDto): Promise<OtherCost>;
    findAll(): Promise<OtherCost[]>;
    findOne(id: number): Promise<OtherCost>;
    update(id: number, updateOtherCostDto: UpdateOtherCostDto): Promise<OtherCost>;
    remove(id: number): Promise<OtherCost>;
}
