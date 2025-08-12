import type { FormAllParts, LevelRepairForm } from "./administrationTypes";
import type { User } from "./authenTypes";
import type { Model } from "./repairTypes";


export interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
export interface Bin {
    id?: number;
    name: string;
    type: string;
    branch: number
}
export interface BinBranchType {
    id: number;
    type: string
}
export interface References {
    id?: number;
    materialCode: string;
    description?: string;
    modelIds: number | number[];
    allpart: number | FormAllParts;
}

export interface FormStock {
    id?: number;
    bin: number;
    remark: string;
    serialnumber: string;
    reference: number;
    userId?: number;
}
export interface ApproveStockForm {
  id?: number;
  type?: string;
  date?: Date;
  state?: string;
  idPartRepair?: number;
  stockPart?:FormStock
}
export interface getFormStock {
    id?: number;
    bin: GetBin;
    remark: string;
    serialnumber: string;
    reference: GetReferences;
    userId?: User;
     
}
export interface StockPartItem{

}
export interface GetReferences {
    id?: number;
    materialCode: string;
    description?: string;
    modelIds: Model[];
    allpart: FormAllParts;
}

export interface GetBin {
    id?: number;
    name: string;
    type: string;
    branch: Agency
}

export interface TransfertPR {
    id?: number;
    delivredBy?: string;
    
    sendingDate?: Date;
    frombranch?: number;
    sendUser?: number;
    
    receivedDate?: Date;
    tobranch?: number;
    receiveUser?: number;
    
    type?: string;
    state?: string;
    remark?: string;
    
    typePart?:string;
    repairIds?: number[];
    stockPartIds?: number[]  ;
    stockPart?: FormStock[];
    bin?: number;
    actuellybranch?:number
}

export interface TypeBranchTransfert {
  typePart: string;
  branchId: number;
}

export interface PartPriceForm {
    id?: number;
    price?: number;
    model?: number | Model;
    allPart?: number | FormAllParts;
    levelRepair?: number | LevelRepairForm;
}