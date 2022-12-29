import { ILocation } from './location.interface';

export interface IProjectRoute {
  routeId?: string;
  routeNumber: string;
  projectId: string;
  projectName: string;
  routeDate: string;
  detail: ILocation[];
}
