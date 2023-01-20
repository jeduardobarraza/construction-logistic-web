

import { ISaleUnit } from './saleUnit.interface';

export interface IOrder {
  orderId?: string;
  orderNumber: string,
  confNumber: string,
  orderDate: string,
  product: string,
  material: string,
  finish: string,
  saleUnits: ISaleUnit,
}
