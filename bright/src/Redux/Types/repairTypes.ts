import type { AppDispatch } from "../store";

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
  actuellyBranch: string;
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
  customer: number;
  device: number;
  remark: string;
  deviceStateReceive: string;
  actuellyBranch: string;
  accessoryIds: number[];
  listFaultIds: number[];
  customerRequestIds: number[];
  userId: number;
}


export interface RepairFormInput {
  accessoryIds: number[];
  listFaultIds: number[];
  customerRequestIds: number[];
  deviceStateReceive: string;
  remark: string;
  actuellyBranch: string;
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

 