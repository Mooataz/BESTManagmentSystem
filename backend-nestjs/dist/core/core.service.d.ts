import { CreateCoreDto } from './dto/create-core.dto';
import { UpdateCoreDto } from './dto/update-core.dto';
export declare class CoreService {
    create(createCoreDto: CreateCoreDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCoreDto: UpdateCoreDto): string;
    remove(id: number): string;
}
