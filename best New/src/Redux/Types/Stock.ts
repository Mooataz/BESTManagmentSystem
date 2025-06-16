import type { Model } from "./repairTypes";

export interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
export interface Bin {
    id?:number;
    name: string;
    type: string;
    branch: Agency
}

 export interface References {
     id? : number;
     materialCode: string;
     description?: string;
     model : Model[];
     allpart : number;
 }