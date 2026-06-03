

export interface FormAllParts {
  id?: number;
  description: string
}

export interface Company {
  id: number;
  name: string;
  headquarterslocation: string;
  taxRegisterNumber: string;
  rib: number;
  logo: string;
  bank: string;
  quantityAlertStock: number;
  tva?: number;
  timbreFiscale?: number;
}
export interface LevelRepairForm {
  id?: number;
  name: string;
  price: number;
  brand?: number;
}

export interface FormLisFrais {
  id?: number;
  price: number;
  name: string;
  status: string;
}