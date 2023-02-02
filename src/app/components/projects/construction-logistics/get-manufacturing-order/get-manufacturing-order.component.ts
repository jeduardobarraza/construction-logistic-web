/* eslint-disable prettier/prettier */
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { split } from 'lodash';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { GetRouteComponent } from '../get-route/get-route.component';
import { SalesUnitLocationComponent } from '../sales-unit-location/sales-unit-location.component';

@Component({
  selector: 'app-get-manufacturing-order',
  templateUrl: './get-manufacturing-order.component.html',
  styleUrls: ['./get-manufacturing-order.component.scss']
})
export class GetManufacturingOrderComponent implements OnInit {
  show = true;

  saleUnitsList: any[] = [];
  confNumberList: any[] = [];
  tlConfNumberList: any[] = [];
  productList: any[] = [];
  tlProductList: any[] = [];

  obj: any = {
    projectId: undefined
  };

  pieceListTooltip = 'Lista de Piezas';
  saleUnitLocationTooltip = 'Ubicación de las Unidades de Ventas';

  constructor(
    private api: ConstructionLogisticsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    const { obj } = data || {};
    console.log('obj>>>', obj);
    this.obj = obj;
    if (obj) {
      this.saleUnitsList = obj.saleUnits;
      this.confNumberList = obj.confNumber; //split(obj.confNumber, ';');
      this.tlConfNumberList = obj.tlConfirmationNumber;
      this.productList = obj.product;
      this.tlProductList = obj.detail;
    }
    console.log('saleUnitsList', this.saleUnitsList);
    console.log(this.confNumberList);
    console.log(this.productList);

  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.pieceListTooltip = 'Lista de Piezas';
    this.saleUnitLocationTooltip = 'Ubicación de las Unidades de Ventas';
  }

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
    dialogRef.afterClosed().subscribe(async () => { });
  };

  LocationUnitSale = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };

    dialogConfig.height = '550px';
    dialogConfig.width = '1200px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(
      SalesUnitLocationComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(async () => { });
  };
}
