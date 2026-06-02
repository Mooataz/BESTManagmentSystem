import { CreateStocKeeperDto } from './dto/create-stoc-keeper.dto';
import { UpdateStocKeeperDto } from './dto/update-stoc-keeper.dto';
export declare class StocKeeperService {
    create(createStocKeeperDto: CreateStocKeeperDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStocKeeperDto: UpdateStocKeeperDto): string;
    remove(id: number): string;
}
