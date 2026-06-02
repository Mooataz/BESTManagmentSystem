import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';
export declare class CoordinateService {
    create(createCoordinateDto: CreateCoordinateDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCoordinateDto: UpdateCoordinateDto): string;
    remove(id: number): string;
}
