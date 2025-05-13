import { StocKeeperService } from './stoc-keeper.service';
import { CreateStocKeeperDto } from './dto/create-stoc-keeper.dto';
import { UpdateStocKeeperDto } from './dto/update-stoc-keeper.dto';
export declare class StocKeeperController {
    private readonly stocKeeperService;
    constructor(stocKeeperService: StocKeeperService);
    create(createStocKeeperDto: CreateStocKeeperDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStocKeeperDto: UpdateStocKeeperDto): string;
    remove(id: string): string;
}
