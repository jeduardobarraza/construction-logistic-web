import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ConstructionLogisticsComponent } from '../construction-logistics.component';
import { GetManufacturingOrderComponent } from '../get-manufacturing-order/get-manufacturing-order.component';
import { GetRouteComponent } from '../get-route/get-route.component';

@Component({
  selector: 'app-sales-unit-location',
  templateUrl: './sales-unit-location.component.html',
  styleUrls: ['./sales-unit-location.component.scss']
})
export class SalesUnitLocationComponent implements OnInit {
  id: any;

  obj: any = {
    projectId: undefined
  };

  inputRows = [{ position: 1 }];
  saleUnitsTitles: any[] = [];
  saleUnitsList: any[] = [];

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data: any) {
    const { obj } = data || {};
    console.log('obj>>', obj);
    this.obj = obj;
    if (obj) {
      this.transformSalesUnitView();
    }

    this.id = data.id;
  }

  ngOnInit(): void {}

  addItem() {
    this.inputRows.push({ position: this.inputRows.length + 1 });
  }
  removeItem(index: number) {
    this.inputRows.splice(index, 1);
  }

  manufacturingOrder = async (type: string, obj: any = null) => {
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

  logisticProject = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };

    dialogConfig.height = '750px';
    dialogConfig.width = '1800px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(
      ConstructionLogisticsComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(async () => {});
  };
}
