import { Brand } from "src/brands/entities/brand.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class LevelRepair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('float')
    price: number;

    @ManyToMany( () => Brand, (brand) => brand.levelRepair)
    brand: Brand;

    @OneToMany( () => PartsPrice, (partsPrice) => partsPrice.levelRepair)
    partsPrice: PartsPrice;
}
