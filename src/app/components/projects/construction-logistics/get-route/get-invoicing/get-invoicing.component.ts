import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetInvoicePdfComponent } from './get-invoice-pdf/get-invoice-pdf.component';

@Component({
  selector: 'app-get-invoicing',
  templateUrl: './get-invoicing.component.html',
  styleUrls: ['./get-invoicing.component.scss']
})
export class GetInvoicingComponent implements OnInit {
  byUnits = true;
  squareMeter = false;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  getInvoicePDF = async (byUnits: boolean, squareMeter: boolean) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (byUnits === true && squareMeter === false) {
      dialogConfig.data = {
        id: 'U'
      };
    } else if (squareMeter === true && byUnits === false) {
      dialogConfig.data = {
        id: 'S'
      };
    } else if (byUnits === true && squareMeter === true) {
      dialogConfig.data = {
        id: 'O'
      };
    } else {
      dialogConfig.data = {
        id: 'O'
      };
    }

    // dialogConfig.width = '1200px';
    dialogConfig.height = '600px';

    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetInvoicePdfComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async () => {});
  };
}
