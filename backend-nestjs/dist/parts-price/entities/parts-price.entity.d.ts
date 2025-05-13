import { AllPart } from "src/all-parts/entities/all-part.entity";
import { LevelRepair } from "src/level-repair/entities/level-repair.entity";
import { Model } from "src/models/entities/model.entity";
export declare class PartsPrice {
    id: number;
    price: number;
    model: Model;
    allPart: AllPart;
    levelRepair: LevelRepair;
}
