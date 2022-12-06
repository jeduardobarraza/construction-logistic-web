import { Injectable } from '@angular/core';
import { IPiece } from '../interfaces/piece.interface';
import { ISet } from '../interfaces/set.interface';
import { ApiHelperService } from './api-helper.service';
import { IApiHelperOptions } from '../interfaces/api-helper-options.interface';
import { TASK_LEVER_CORE_ENDPOINTS } from './service-constants';

const CALL_CONTROLLER = 'call';
const DOMAIN = 'https://www.tasklever.com/desktopmodules/TL_ServidorDeApis/api';
@Injectable({
  providedIn: 'root'
})
export class TaskLeverCoreService {
  createProperty: any;
  constructor(private apiHelper: ApiHelperService) {}

  getAsyncInCore = (
    options: IApiHelperOptions = {},
    controller: string = CALL_CONTROLLER
  ) => this.apiHelper.getAsync(controller, options, DOMAIN);

  getClientsWithConfirmations = (
    clientId: number = 0,
    status: string = 'A'
  ) => {
    const options: IApiHelperOptions = {
      path: TASK_LEVER_CORE_ENDPOINTS.CALL_CLIENT.GET_CLIENT_WITH_CONFIRMATIONS,
      query: `id=${clientId}&idEst=${status}`
    };
    return this.getAsyncInCore(options);
  };

  getProjectsWithConfirmations = (
    projectId: number = 0,
    status: string = 'A'
  ) => {
    const options: IApiHelperOptions = {
      path: TASK_LEVER_CORE_ENDPOINTS.CALL_PROJECT
        .GET_PROJECT_WITH_CONFIRMATIONS,
      query: `id=${projectId}&idEst=${status}`
    };
    return this.getAsyncInCore(options);
  };
}
