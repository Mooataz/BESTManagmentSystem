import { CoordinateService } from './coordinate.service';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';
export declare class CoordinateController {
    private readonly coordinateService;
    constructor(coordinateService: CoordinateService);
    create(createCoordinateDto: CreateCoordinateDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCoordinateDto: UpdateCoordinateDto): string;
    remove(id: string): string;
}
