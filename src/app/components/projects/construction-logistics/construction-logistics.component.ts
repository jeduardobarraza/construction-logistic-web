import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { get, split, set, cloneDeep, cloneWith } from 'lodash';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import CommonCells from 'src/app/utils/common-cell';
import jsPDF from 'jspdf';
import { GetManufacturingOrderComponent } from './get-manufacturing-order/get-manufacturing-order.component';
import { GetRouteComponent } from './get-route/get-route.component';
import { GetInvoiceHistoryComponent } from './get-invoice-history/get-invoice-history.component';
import { IProjectLocation } from 'src/app/interfaces/projectLocation.interface';
import { ToastrService } from 'ngx-toastr';
import { IProjectRoute } from '../../../interfaces/projectRoute.interface';
import { I } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-construction-logistics',
  templateUrl: './construction-logistics.component.html',
  styleUrls: ['./construction-logistics.component.scss']
})
export class ConstructionLogisticsComponent implements AfterViewInit {
  obj: any = {
    projectId: undefined
  };
  tagList: string[] = [];
  saleUnitsList: any[] = [];
  setsList: any[] = [];
  piecesList: any[] = [];
  ordersList: any[] = [];
  ordersQuantity: any[] = [];
  ordersByProject: any[] = [];

  setsItems: any[] = [];

  location: IProjectLocation = {
    projectId: '',
    projectName: '',
    projectLocationId: '',
    detail: []
  };
  route: IProjectRoute = {
    routeId: '',
    projectId: '',
    projectName: '',
    routeNumber: '',
    routeDate: '',
    detail: []
  };
  saleUnitLocation: any = {
    saleUnits: {},
    quantity: 0
  };

  details = [];

  totales: any[] = [];

  orderStatusList = ['open', 'close'];
  orderStatusListSelect: any = this.orderStatusList[0];
  workshopStatus = ['cutting', 'veneer', 'machined', 'plug'];

  public loading = true;
  public columnDefsOrders: ColDef[] = [];
  public defaultColDefOrders: ColDef = {
    sortable: true,
    filter: true
  };
  tableColumnsProperties = {};
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  saleUnitsTitles: any[] = [];

  inputRows = [{ position: 1 }];
  inputRowsRoute = [{ position: 1 }];
  floor = false;
  tower = false;
  numberOfTowers = 0;
  numberOfFloors = 0;
  pdfInstance: any;
  pdfPageHandler: any = {
    line: 20,
    pages: [{ pageNumber: 1, header: false }]
  };

  invoiceHistoryTooltip = 'Histórico Factura';
  routeTooltip = 'Recorridos';
  homeTooltip = 'Inicio';
  newOrderTooltip = 'Nuevo Pedido';
  saveLocations = 'Guardar localizaciones';
  saveRoute = 'Guardar Recorrido';
  floorLocation = 'Piso';
  towerLocation = 'Torre';
  towerList: string[] = [];
  floorList: string[] = [];

  ordersTable = {
    orderNumber: '# de Pedido',
    orderStatus: 'Estado de Pedido',
    workshopStatus: 'Estado Taller'
  };

  locations: any[] = [];
  locationsList: any[] = [];
  locationsQuantity: any[] = [];
  locationsRoute: any[] = [];
  locationsListRoute: any[] = [];
  locationsQuantityRoute: any[] = [];
  saleUnitList: any[] = [];
  create: boolean = true;
  totals: any[] = [];
  totalsToOrder: any[] = [];

  routes: any[] = [];

  constructor(
    private api: ConstructionLogisticsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private toastr: ToastrService
  ) {
    const { obj } = data || {};
    console.log('obj>>', obj);
    this.obj = obj;
    if (obj) {
      this.tagList = split(obj.tags, ';');
      this.transformSalesUnitView();
      this.loadSetsByProject();
    }

    this.location.projectId = obj.projectId;
    this.route.projectId = obj.projectId;
    this.location.projectName = obj.tlProjectName;
    this.route.projectName = obj.tlProjectName;
    console.log(this.location);
    console.log(this.saleUnitsList);
    this.asignLocation(this.saleUnitsList);
    this.listOrders();
    this.listRoutes();
  }
  asignLocation(list: any) {
    for (let set of this.setsItems) {
      for (let unit of list[set]) {
        this.totales.push({ unidad: unit.name, quantity: unit.quantity });
        //console.log('cantidad de ' + unit.name + ': ' + unit.quantity);
      }
    }
    console.log(this.totales);
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      console.log('>>>>>');
      await this.buildTableColumns();
      await this.loadOrdersQuantity();
      await this.loadPieces();
      await this.loadOrderByProject();
    });
  }

  changeTower() {
    let torre = '';
    for (let i = 0; i < this.numberOfTowers; i++) {
      torre = 'Torre ' + (i + 1);
      this.towerList[i] = torre;
    }
  }
  changeFloor() {
    let piso = '';
    for (let i = 0; i < this.numberOfFloors; i++) {
      piso = 'Piso ' + (i + 1);
      this.floorList[i] = piso;
    }
  }
  addItem(index: number) {
    let clonedSaleUnits = cloneDeep(this.locations[0].saleUnits);
    clonedSaleUnits.map((saleUnit: any) => {
      saleUnit.quantity = 0;
    });
    this.locations.splice(index + 1, 0, {
      location: '',
      saleUnits: clonedSaleUnits
    });
  }

  removeItem(index: number) {
    this.inputRows.splice(index, 1);
    this.locations.splice(index, 1);
  }

  listOrders = async () => {
    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        this.locationsQuantity.push(saleUnit);
      }
    }

    this.locationsList = await this.api.getProjectLocation(this.obj.projectId);
    if (this.locationsList.length > 0) {
      for (let location of this.locationsList) {
        console.log(location);
        if (location.projectId == this.obj.projectId) {
          this.create = false;
          this.location.projectLocationId = location.projectLocationId;
          for (let detail of location.detail) {
            this.locations.push(detail);
          }
        }
      }
    }
    if (this.create) {
      this.create = true;
      this.locations = [{ location: '', saleUnits: [] }];
      // for (let unit of this.locationsQuantity) {
      //   this.locations[0].saleUnits.push({ quantity: 0, saleUnit: unit });
      // }
    }
    this.location.detail = this.locations;
    let condition: boolean = false;
    for (let i = 0; i < this.locationsQuantityRoute.length; i++) {
      for (let j = 0; j < this.locationsRoute.length; j++) {
        condition = false;
        for (let k = 0; k < this.locations[j].saleUnits.length; k++) {
          if (
            this.locationsQuantity[i].name ==
            this.locations[j].saleUnits[k].saleUnit.name
          ) {
            condition = true;
          }
        }
        if (condition == false) {
          this.locations[j].saleUnits.push({
            quantity: 0,
            saleUnit: this.locationsQuantity[i]
          });
        }
      }
    }

    // console.log(this.location);
    console.log(this.locationsQuantity);
    // console.log(this.locationsList);
    console.log(this.locations);
    this.totalLocations();
  };
  ///////////
  addProjectLocation = async () => {
    this.location.detail = this.locations;
    this.totalLocations();
    let validate: boolean = true;
    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        console.log(saleUnit);
        for (let unit of this.totals) {
          if (unit.saleUnit.name == saleUnit.name) {
            if (unit.quantity > saleUnit.quantity) {
              validate = false;
            }
          }
        }
      }
    }
    if (validate) {
      if (this.create) {
        await this.api.createLocation(this.location.projectId, this.location);
        this.toastr.success('Localizaciones creadas con éxito!');
        console.log('location Create');
      } else {
        await this.api.updateLocation(
          this.location.projectId,
          this.location.projectLocationId,
          this.location
        );
        this.toastr.success('Localizaciones actualizadas con éxito!');
        console.log('location Update');
      }
    } else
      this.toastr.error(
        'El numero de Unidades de venta es mayor a los contratados'
      );
  };
  /////////
  listRoutes = async () => {
    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        this.locationsQuantityRoute.push(saleUnit);
      }
    }

    this.locationsListRoute = await this.api.getProjectRoute(
      this.obj.projectId
    );
    if (this.locationsListRoute.length > 0) {
      for (let route of this.locationsListRoute) {
        console.log(route);
        if (route.projectId == this.obj.projectId) {
          this.create = false;
          this.route.routeId = route.routeId;
          for (let detail of route.detail) {
            this.locationsRoute.push(detail);
          }
        }
      }
    }
    if (this.create) {
      this.create = true;
      this.locationsRoute = [{ location: '', saleUnits: [] }];
      // for (let unit of this.locationsQuantity) {
      //   this.locations[0].saleUnits.push({ quantity: 0, saleUnit: unit });
      // }
    }
    this.route.detail = this.locationsRoute;
    let condition: boolean = false;
    for (let i = 0; i < this.locationsQuantityRoute.length; i++) {
      for (let j = 0; j < this.locationsRoute.length; j++) {
        condition = false;
        for (let k = 0; k < this.locationsRoute[j].saleUnits.length; k++) {
          if (
            this.locationsQuantityRoute[i].name ==
            this.locationsRoute[j].saleUnits[k].name
          ) {
            condition = true;
          }
        }
        if (condition == false) {
          this.locationsRoute[j].saleUnits.push({
            quantity: 0,
            saleUnit: this.locationsQuantityRoute[i]
          });
        }
      }
    }

    console.log(this.locationsQuantityRoute);
    console.log(this.locationsRoute);
    this.route.detail = this.locationsRoute;
    console.log(this.route);
  };
  /////////
  updateRoute() {
    console.log('updateRoute function');
  }
  /////////
  totalLocations() {
    this.totals = cloneDeep(this.locations[0].saleUnits);
    this.totalsToOrder = cloneDeep(this.locations[0].saleUnits);
    this.totals.map((saleUnit: any) => {
      saleUnit.quantity = 0;
    });
    this.totalsToOrder.map((saleUnit: any) => {
      saleUnit.quantity = 0;
    });
    console.log(this.totalsToOrder);

    for (let location of this.locations) {
      for (let i = 0; i < location.saleUnits.length; i++) {
        if (location.saleUnits[i].quantity > 0) {
          this.totals[i].quantity += location.saleUnits[i].quantity;
        }
      }
    }

    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        console.log(saleUnit);
        for (let i = 0; i < this.totals.length; i++) {
          if (this.totals[i].saleUnit.name == saleUnit.name) {
            this.totalsToOrder[i].quantity =
              saleUnit.quantity - this.totals[i].quantity;
          }
        }
      }
    }
  }

  manufacturingOrder = async (type: string, obj: any) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };

    dialogConfig.height = '1750px';
    dialogConfig.width = '1000px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(
      GetManufacturingOrderComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(async () => {});
  };

  getInvoiceHistory = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };

    dialogConfig.height = '300px';
    dialogConfig.width = '400px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(
      GetInvoiceHistoryComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(async () => {});
  };

  getRoute = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };

    dialogConfig.height = '400px';
    dialogConfig.width = '500px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetRouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async () => {});
  };

  onCellClicked(e: any) {
    console.log('cellClicked', e);
    if (e.colDef.colId === 'btnArchive') {
      this.manufacturingOrder(e.data.type, e.data);
    }
  }

  buildTableColumns = async () => {
    const fields = ['orderNumber'];
    const columnDefs: ColDef[] = [];

    fields.map(async (field) => {
      const headerName = get(this.ordersTable, field);
      const columnProperties = get(this.tableColumnsProperties, field, {});
      const column = {
        ...columnProperties,
        colId: field,
        headerName,
        field
      };
      columnDefs.push(column);
    });

    const orderStatusColumn = {
      headerName: 'Estado de Pedido',
      field: 'open',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: this.orderStatusList }
    };
    columnDefs.push(orderStatusColumn);

    const workshopStatusColumn = {
      headerName: 'Estado Taller',
      field: 'cutting',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: this.workshopStatus }
    };
    columnDefs.push(workshopStatusColumn);

    const archiveColumn = {
      colId: 'btnArchive',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.archiveCellRenderer
    };
    columnDefs.push(archiveColumn);

    const annulColumn = {
      colId: 'btnAnnul',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.annulCellRenderer
    };
    columnDefs.push(annulColumn);

    const checkColumn = {
      colId: 'btnCheck',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.checkCellRenderer
    };
    columnDefs.push(checkColumn);

    const duplicateColumn = {
      colId: 'btnCheck',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.duplicateCellRenderer
    };
    columnDefs.push(duplicateColumn);

    const historyColumn = {
      colId: 'btnCheck',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.historyCellRenderer
    };
    columnDefs.push(historyColumn);

    const viewColumn = {
      colId: 'btnCheck',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.viewCellRenderer
    };
    columnDefs.push(viewColumn);

    this.columnDefsOrders = columnDefs;
  };

  transformSalesUnitView = () => {
    const groupedSalesUnit: any = {};
    (this.obj?.detail || []).map((saleUnit: any) => {
      if (!groupedSalesUnit[saleUnit.group])
        groupedSalesUnit[saleUnit.group] = [];
      groupedSalesUnit[saleUnit.group].push(saleUnit);
    });

    this.saleUnitsList = groupedSalesUnit;
    this.saleUnitsTitles = Object.keys(groupedSalesUnit).sort();
    console.log('groupedSalesUnit>>>', groupedSalesUnit);
  };

  loadOrdersQuantity = async () => {
    const orderQuantity = await this.api.getProjectOrdersWithQuantity(
      this.obj.projectId
    );
    this.ordersQuantity = orderQuantity;
    console.log('ordersQuantity', this.ordersQuantity);
  };

  loadSetsByProject = () => {
    const setByProject: any = {};
    let setList: any[] = this.obj ? this.obj.detail : [];
    console.log(setList);
    (this.obj?.detail || []).map((set: any) => {
      if (!setByProject[set.group]) setByProject[set.group] = [];
      setByProject[set.group].push(set);
    });
    const setByUnit: any[] = [];
    for (let unit of setList) {
      if (unit.sets.length >= 1) setByUnit.push(unit.sets);
      console.log(unit);
      console.log(setByUnit);
    }
    console.log(setByUnit);

    this.setsList = setByProject;
    this.setsItems = Object.keys(setByProject).sort();
    console.log('setByProject', setByProject);
    console.log(this.setsList);
    console.log(this.setsItems);
  };

  loadPieces = async () => {
    const pieceByProject: any = {};
    let pieceList: any[] = this.obj ? this.obj.detail : [];
    console.log(pieceList);
    (this.obj?.detail || []).map((piece: any) => {
      if (!pieceByProject[piece.group]) pieceByProject[piece.group] = [];
      pieceByProject[piece.group].push(set);
    });
    console.log(pieceByProject);
    //const pieceList = await this.api.getPiecesByType('');
    this.agGrid.api.setRowData(pieceList);
    this.loading = false;
    this.piecesList = pieceList;
    console.log('piecesList', this.piecesList);
  };

  loadOrders = async () => {
    const oderList = await this.api.getOrder();
    this.agGrid.api.setRowData(oderList);
    this.loading = false;
    this.ordersList = oderList;
    console.log('ordersList', this.ordersList);
  };

  loadOrderByProject = async () => {
    const orderByProject = await this.api.getProjectOrders(this.obj.projectId);
    this.agGrid.api.setRowData(orderByProject);
    this.ordersByProject = orderByProject;
    console.log('ordersByProject', this.ordersByProject);
  };

  historyPDF() {
    this.pdfPageHandler = {
      line: 20,
      pages: [{ pageNumber: 1, header: false }]
    };
    this.pdfInstance = new jsPDF();

    this.pdfInstance.setFont('helvetica');

    this.pdfInstance.setFontSize(7);

    const blob = this.pdfInstance.output('blob');
    window.open(URL.createObjectURL(blob));
  }
}
