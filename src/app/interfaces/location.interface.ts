import { ISaleUnitlocation } from './saleUnitlocation.interface';

export interface ILocation {
  location: string;
  contractorId: string;
  saleUnits: ISaleUnitlocation[];
}
