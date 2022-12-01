import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SalesUnitLocationComponent } from '../sales-unit-location/sales-unit-location.component';
import { GetInvoicingComponent } from './get-invoicing/get-invoicing.component';

@Component({
  selector: 'app-get-route',
  templateUrl: './get-route.component.html',
  styleUrls: ['./get-route.component.scss']
})
export class GetRouteComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  getInvoice = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type,
      obj
    };
    dialogConfig.width = '350px';
    dialogConfig.height = '400px';

    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetInvoicingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async () => {});
  };

  LocationUnitSale = async (type: string, obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 'R',
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
    dialogRef.afterClosed().subscribe(async () => {});
  };
}
