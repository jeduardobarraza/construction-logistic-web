import { IPieceDimensions } from './piece-dimensions.interface';
import { IProperty } from './property.interface';

export interface IPiece {
  pieceId?: string;
  name: string;
  reference: string;
  dimensions: IPieceDimensions;
  type: string;
  tags: string;
  properties: IProperty[];
  quantity: number;
}
