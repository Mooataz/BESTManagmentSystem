import { Brand } from "src/brands/entities/brand.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
export declare class LevelRepair {
    id: number;
    name: string;
    price: number;
    brand: Brand;
    partsPrice: PartsPrice;
}
