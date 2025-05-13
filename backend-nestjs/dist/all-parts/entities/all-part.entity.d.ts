import { Model } from "src/models/entities/model.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
import { Reference } from "src/references/entities/reference.entity";
import { Sale } from "src/sales/entities/sale.entity";
export declare class AllPart {
    id: number;
    description: string;
    model: Model[];
    reference: Reference[];
    partsPrice: PartsPrice[];
    sale: Sale[];
}
