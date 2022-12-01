import { IPieceDimensions } from './piece-dimensions.interface';
import { IPiece } from './piece.interface';
import { ISet } from './set.interface';

export interface ISaleUnit {
  saleUnitId?: string;
  name: string;
  reference: string;
  description: string;
  group: string;
  supplyValue: string;
  installValue: string;
  dimensions: IPieceDimensions;
  sets: ISet[];
  pieces: IPiece[];
  quantity: number;
}
