import { AllPart } from "src/all-parts/entities/all-part.entity";
import { Model } from "src/models/entities/model.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
export declare class Reference {
    id: number;
    materialCode: string;
    description: string;
    stockPart: StockPart[];
    model: Model[];
    allpart: AllPart;
}
