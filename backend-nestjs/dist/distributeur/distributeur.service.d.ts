import { CreateDistributeurDto } from './dto/create-distributeur.dto';
import { UpdateDistributeurDto } from './dto/update-distributeur.dto';
import { Distributeur } from './entities/distributeur.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class DistributeurService {
    private readonly distributeurRepositry;
    private appService;
    constructor(distributeurRepositry: Repository<Distributeur>, appService: AppService);
    create(createDistributeurDto: CreateDistributeurDto): Promise<Distributeur>;
    findAll(): Promise<Distributeur[]>;
    findOne(id: number): Promise<Distributeur>;
    update(id: number, updateDistributeurDto: UpdateDistributeurDto): Promise<Distributeur>;
    remove(id: number): Promise<Distributeur>;
}
