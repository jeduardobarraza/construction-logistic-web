import { ISaleUnitlocation } from './saleUnitlocation.interface';

export interface ILocation {
  location: string;
  saleUnits: ISaleUnitlocation[];
}
