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

// types.ts
export interface RepairForm {
  accessoryIds: number[];
  listFaultIds: number[];
  customerRequestIds: number[];
  deviceStateReceive: string;
  remark?: string;
  actuellyBranch: string;
  device: number;
  customer: number;
}

export interface AsyncThunkConfig {
  state?: unknown;
  dispatch?: AppDispatch;
  extra?: unknown;
  rejectValue: string;
}