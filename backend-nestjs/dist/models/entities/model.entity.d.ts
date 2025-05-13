import { AllPart } from "src/all-parts/entities/all-part.entity";
import { Brand } from "src/brands/entities/brand.entity";
import { Device } from "src/devices/entities/device.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
import { Reference } from "src/references/entities/reference.entity";
import { TypeModel } from "src/type-model/entities/type-model.entity";
export declare class Model {
    id: number;
    name: string;
    picture: string;
    brand: Brand;
    typeModel: TypeModel;
    device: Device[];
    reference: Reference;
    allpart: AllPart[];
    partsPrice: PartsPrice[];
}
