import { IPieceDimensions } from './piece-dimensions.interface';

export interface ISet {
  setId?: string;
  name: string;
  reference: string;
  description: string;
  dimensions: IPieceDimensions;
  tags: string;
  sets: any[];
  pieces: any[];
  quantity: number;
}
