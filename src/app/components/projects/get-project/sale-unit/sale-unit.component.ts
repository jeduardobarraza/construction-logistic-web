import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';
import { get } from 'lodash';
import { observable, Observable } from 'rxjs';
import { GetLibraryComponent } from '../../get-library/get-library.component';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ISaleUnit } from 'src/app/interfaces/saleUnit.interface';

@Component({
  selector: 'app-sale-unit',
  templateUrl: './sale-unit.component.html',
  styleUrls: ['./sale-unit.component.scss']
})
export class SaleUnitComponent implements OnInit {
  tittle = '';

  obj: ISaleUnit = {
    name: '',
    reference: '',
    description: '',
    group: '',
    supplyValue: '',
    installValue: '',
    dimensions: {},
    sets: [],
    pieces: [],
    quantity: 1
  };

  @ViewChild('agGridDetail') agGridDetail!: AgGridAngular;
  @ViewChild('agGridSaleUnit') agGridSaleUnit!: AgGridAngular;
  //@ViewChild('agGridPiece') agGridPiece!: AgGridAngular;

  public rowData$!: Observable<any[]>;
  salesUnitDetail: any[] = [];
  gridOptionsModule: GridOptions;
  subSetsList: any[] = [];
  pieceList: any[] = [];

  delCellRenderer = function () {
    let html = "<span style='font-size:21px; color:goldenrod;'>&#9733;</span>";
    return `<mat-icon class="mat-icon material-icons" style="color:#dc3545;cursor:pointer;" role="img" aria-hidden="true">clear</mat-icon>`;
  };

  dimensionCellRender = (params: any) => {
    const width = get(params, 'data.dimensions.width', 0);
    const depth = get(params, 'data.dimensions.depth', 0);
    const height = get(params, 'data.dimensions.height', 0);
    const dimensionString = `${width} X ${height} X ${depth}`;
    return dimensionString;
  };

  propertiesCellRender = (params: any) => {
    const property = get(params, 'data.properties[0].property', '');
    const value = get(params, 'data.properties[0].value', '');
    const propertyString = `${property}: ${value}`;
    return propertyString;
  };

  columnDefsModule: any[] = [
    {
      headerName: 'Módulo/componente',
      field: 'name',
      filter: true,
      width: 200
    },
    { headerName: 'Referencia', field: 'reference', filter: true, width: 140 },
    {
      headerName: 'Dimensión (mm)',
      field: 'dimension',
      filter: true,
      width: 140,
      cellRenderer: this.dimensionCellRender
    },
    { headerName: 'Etiqueta(s)', field: 'tags', filter: true, width: 200 },
    {
      headerName: 'Propiedad',
      field: 'properties',
      filter: true,
      width: 200,
      cellRenderer: this.propertiesCellRender
    },
    //{ headerName: 'Tipo', field: 'type', filter: true, width: 140 },
    {
      headerName: 'Cantidad',
      field: 'amount',
      filter: true,
      editable: true,
      width: 120
    },
    {
      groupId: 'DelBtn',
      sortable: true,
      width: 35,
      suppressMenu: true,
      resizable: true,
      cellRenderer: this.delCellRenderer,
      tooltipValueGetter: function getTooltip() {
        return 'Eliminar';
      }
    }
  ];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private constructionLogisticsApi: ConstructionLogisticsService,
    //public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SaleUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gridOptionsModule = <GridOptions>{
      rowSelection: 'single',
      localeText: { noRowsToShow: 'No se encontraron registros...' }
    };
    console.log(data);
    this.tittle = data.title;
    this.subSetsList = data.sets;
    this.pieceList = data.pieces;
    this.salesUnitDetail = data.sets.concat(data.pieces);
  }

  ngOnInit(): void {}

  openLibrary() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 'M',
      title: 'Angular For Beginners',
      viewMode: 'choosing',
      hidePieces: true
    };
    dialogConfig.height = '800px';
    dialogConfig.width = '1000px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetLibraryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log('>>>>>>>>>>, data', data);
      if (data?.selected) {
        this.salesUnitDetail.push(data.obj);
        this.agGridDetail.api.setRowData(this.salesUnitDetail);
      }
      if (data?.selected && data.obj.setId) {
        this.subSetsList.push(data.obj);
        //this.agGridSubSet.api.setRowData(this.subSetsList);
      } else if (data?.selected && data.obj.pieceId) {
        this.pieceList.push(data.obj);
        //this.agGridPiece.api.setRowData(this.pieceList);
      }
    });
  }
  onCellClicked(par: any) {
    if (par.colDef.groupId == 'DelBtn') {
      this.delRow(par);
    }
  }

  delRow(param: any) {
    console.log(this.salesUnitDetail);
    console.log(param);
    this.salesUnitDetail.splice(param.rowIndex, 1);
    this.agGridDetail.api.setRowData(this.salesUnitDetail);
    // this.subSetsList = [];
    // this.pieceList = [];
    // for (let i = 0; this.salesUnitDetail.length < i; i++) {
    //   if (this.salesUnitDetail[i].setId) {
    //     this.subSetsList.push(this.salesUnitDetail[i]);
    //   } else {
    //     this.pieceList.push(this.salesUnitDetail[i]);
    //   }
    // }
    if (param.data.setId) {
      console.log('entro al if de set');
      if (this.subSetsList.length > 1) {
        for (let i = 0; this.subSetsList.length > i; i++) {
          console.log(this.subSetsList[i]);
          if (this.subSetsList[i].setId == param.data.setId)
            console.log(this.subSetsList[i]);
          this.subSetsList.splice(i, 1);
        }
      } else if (this.subSetsList.length == 1) {
        this.subSetsList.splice(0, 1);
      }
    } else if (param.data.pieceId) {
      console.log('entro al if de pieces');
      console.log(this.pieceList);
      if (this.pieceList.length > 1) {
        for (let i = 0; this.pieceList.length > i; i++) {
          if (this.pieceList[i].pieceId == param.data.pieceId)
            console.log(this.pieceList[i]);
          this.pieceList.splice(i, 1);
        }
      } else if (this.pieceList.length == 1) {
        this.pieceList.splice(0, 1);
      }
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.rowData$ = this.http.get<any[]>(
      'https://www.ag-grid.com/example-assets/row-data.json'
    );
  }

  onSave = () => {
    this.loading = true;
    const setSelected: any[] = this.subSetsList ? this.subSetsList : [];
    const pieceSelected: any[] = this.pieceList ? this.pieceList : [];
    const groupSelected: string = this.tittle;
    let saleUnitObject = {
      ...this.obj,
      sets: setSelected,
      pieces: pieceSelected,
      group: groupSelected
    };
    this.getSaleUnit(saleUnitObject.group, saleUnitObject);
    console.log(saleUnitObject);
    return saleUnitObject;
  };

  getSaleUnit(datatype: string, obj: any) {
    this.dialogRef.close({ selected: true, obj });
  }
}
