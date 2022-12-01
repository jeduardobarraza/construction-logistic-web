import { ILocation } from './location.interface';

export interface IProjectLocation {
  projectLocationId?: string;
  projectId: string;
  projectName: string;
  detail: ILocation[];
}
