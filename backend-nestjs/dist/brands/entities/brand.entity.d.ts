import { LevelRepair } from "src/level-repair/entities/level-repair.entity";
import { Model } from "src/models/entities/model.entity";
export declare class Brand {
    id: number;
    name: string;
    logo: string;
    status: string;
    Model: Model;
    levelRepair: LevelRepair;
}
