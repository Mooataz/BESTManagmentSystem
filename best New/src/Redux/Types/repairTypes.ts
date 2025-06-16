import type { AppDispatch } from "../store";
export interface DataGetBranchStep  {
    branch: number | undefined;
    step:string}
export interface Customer {
  id?: number;
  name: string;
  phone: number;
   distributer?: Distributor | null;
}
export interface Distributor {
    id: number; 
    name: string; 
    phone: number; 
    email: string; 
    location: string; 
    taxRegisterNumber: string;
}
export  interface Device {
id?: number;
serialenumber? : string;
purchaseDate? : Date ;
model : Model ;
}
export interface Model{
    id?:number;
    name: string;
    brand: Marque;
    picture: string | File;
    typeModel:TypeModel;
    allpart: number[]
    
}
export interface Marque {

  id?: number;
  name: string;
  logo: string;
  status: string;

}
export interface TypeModel {
    id?: number;
    description: string;
}

export interface TypeUnique{
  id?:number;
  name:string;
}

export type TypeForm = {
  id?: number;
  accessory:TypeUnique[];
  listFault:TypeUnique[];
  customerRequest:TypeUnique[];
  deviceStateReceive: string;
  remark: string;
  actuellybranch: number;
  device: Device;
  customer: Customer
}
export interface Accessory {
    id: number; name: string;
}
export interface ListFault {
    id: number; name: string;
}
export interface CustomerRequest {
    id: number; name: string;
}
// types.ts
// types/repairTypes.ts
export interface RepairForm {
  id?: number;
  customer?: number;
  device?: number;
  remark?: string;
  deviceStateReceive?: string;
  actuellybranch?: number;
  accessoryIds?: number[];
  listFaultIds?: number[];
  customerRequestIds?: number[];
  userId?: number;
  warrenty?: boolean;
  approveRepair?: boolean;
  newSerialNumber: string;
  files?: string[];
  partsNeed?: number[] ;
  notesCustomer ?: number[];
  expertiseReason ?: number[];
  repairAction ?: number[];
}


export interface RepairFormInput {
  accessoryIds: number[];
  listFaultIds: number[];
  customerRequestIds: number[];
  deviceStateReceive: string;
  remark: string;
  actuellyBranch: number;
  device: number;
  customer: number;
  userId: number;
}

export interface AsyncThunkConfig {
  state?: unknown;
  dispatch?: AppDispatch;
  extra?: unknown;
  rejectValue: string;
}

 export interface FormHistoryRepair {
  date: Date;
  step: string;
  repair: number;
  user: { id: number } ;
 }


 export type TableAction = {
   icon: React.ReactNode;
   onClick: (row: Record<string, any>) => void;
 };
 
 export type TableProps = { 
   rows: Record<string, any>[];
   columnsToShow?: string[];
   columnLabels?: Record<string, string>;
   actions?: TableAction[];
 };