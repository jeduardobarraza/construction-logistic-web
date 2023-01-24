import { Injectable } from '@angular/core';
import { IPiece } from '../interfaces/piece.interface';
import { ISet } from '../interfaces/set.interface';
import { ApiHelperService } from './api-helper.service';
import { IConstruction } from '../interfaces/construction.interface';
import { IProjectLocation } from '../interfaces/projectLocation.interface';
import { IProjectRoute } from '../interfaces/projectRoute.interface';
import { IOrder } from '../interfaces/order.interface';

const CONSTRUCTION_CONTROLLER = 'project';
const PIECE_CONTROLLER = 'piece';
const SET_CONTROLLER = 'set';
const SALE_UNIT_CONTROLLER = 'saleUnit';
const ORDER_CONTROLLER = 'order';
const PROJECT_CONTROLLER = 'project';
const LOCATION_CONTROLLER = 'locations';
const ROUTE_CONTROLLER = 'route';

@Injectable({
  providedIn: 'root'
})
export class ConstructionLogisticsService {
  createProperty: any;
  constructor(private apiHelper: ApiHelperService) {}

  ///////////////Projects

  getProjects = () => this.apiHelper.getAsync(CONSTRUCTION_CONTROLLER);

  getProjectById = (projectId: string) =>
    this.apiHelper.getAsync(CONSTRUCTION_CONTROLLER, { path: projectId });
  // createProject = (body: IConstruction) => {
  //   console.log(body);
  //   this.apiHelper.postAsync(CONSTRUCTION_CONTROLLER, { body });
  // };

  // updateProject = (projectId: string, body: IConstruction) =>
  //   this.apiHelper.updateAsync(CONSTRUCTION_CONTROLLER, {
  //     path: projectId,
  //     body
  //   });

  // deleteProject = (projectId: string) =>
  //   this.apiHelper.deleteAsync(CONSTRUCTION_CONTROLLER, {
  //     path: '' + projectId
  //   });

  createProject = (body: IConstruction) => {
    console.log(body);
    this.apiHelper.postAsync(CONSTRUCTION_CONTROLLER, { body });
  };

  updateProject = (projectId: string, body: IConstruction) =>
    this.apiHelper.updateAsync(CONSTRUCTION_CONTROLLER, {
      path: projectId,
      body
    });

  deleteProject = (projectId: string) =>
    this.apiHelper.deleteAsync(CONSTRUCTION_CONTROLLER, {
      path: '' + projectId
    });

  validateSetInUse = (setId: string) =>
    this.apiHelper.getAsync(CONSTRUCTION_CONTROLLER, {
      path: 'validateSet/' + setId
    });

  validatePieceInUse = (pieceId: string) =>
    this.apiHelper.getAsync(CONSTRUCTION_CONTROLLER, {
      path: 'validatePiece/' + pieceId
    });

  //////////////////Sets

  getSetsList = () => this.apiHelper.getAsync(SET_CONTROLLER);

  createSet = (body: ISet) => {
    console.log(body);
    this.apiHelper.postAsync(SET_CONTROLLER, { body });
  };

  updateSet = (setId: string, body: ISet) =>
    this.apiHelper.updateAsync(SET_CONTROLLER, { path: setId, body });

  deleteSet = (setId: string) =>
    this.apiHelper.deleteAsync(SET_CONTROLLER, { path: '' + setId });

  ////////////////piece

  getPiecesByType = (type: string) =>
    this.apiHelper.getAsync(PIECE_CONTROLLER, { query: `type=${type}` });

  getPieceList = () => this.apiHelper.getAsync(PIECE_CONTROLLER);

  createPiece = (body: IPiece) =>
    this.apiHelper.postAsync(PIECE_CONTROLLER, { body });

  updatePiece = (pieceId: string, body: IPiece) =>
    this.apiHelper.updateAsync(PIECE_CONTROLLER, { path: '' + pieceId, body });

  deletePiece = (pieceId: string) =>
    this.apiHelper.deleteAsync(PIECE_CONTROLLER, { path: '' + pieceId });

  //////////////////orders

  getProjectOrdersWithQuantity = async (projectId: any) => {
    const orders = await this.apiHelper.getAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/orders/quantity/saleUnits'
    });
    return orders.length;
  };

  getProjectOrders = (projectId: any) =>
    this.apiHelper.getAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/orders'
    });

  getOrder = () => this.apiHelper.getAsync(ORDER_CONTROLLER);

  createOrder = (projectId: any, body: IOrder) =>
    this.apiHelper.postAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/orders'
    });

  //////////////////locations

  getProjectLocation = (projectId: any) =>
    this.apiHelper.getAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/locations'
    });

  createLocation = (projectId: any, body: IProjectLocation) =>
    this.apiHelper.postAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/locations',
      body
    });

  updateLocation = (
    projectId: string,
    projectLocationId: any,
    body: IProjectLocation
  ) =>
    this.apiHelper.updateAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/locations/' + projectLocationId,
      body
    });

  //////////////////routes

  getProjectRoute = (projectId: any) =>
    this.apiHelper.getAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/route'
    });

  createRoute = (projectId: any, body: IProjectRoute) =>
    this.apiHelper.postAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/route',
      body
    });

  updateRoute = (projectId: string, routeId: any, body: IProjectLocation) =>
    this.apiHelper.updateAsync(PROJECT_CONTROLLER, {
      path: '' + projectId + '/route/' + routeId,
      body
    });
}
