import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { get, isEmpty, split } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { IPieceDimensions } from 'src/app/interfaces/piece-dimensions.interface';
import { ISet } from 'src/app/interfaces/set.interface';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { GetLibraryComponent } from '../get-library.component';

@Component({
  selector: 'app-get-modulo',
  templateUrl: './get-set.component.html',
  styleUrls: ['./get-set.component.scss']
})
export class GetSetComponent implements OnInit {
  dimensions = {
    height: 0,
    width: 0,
    depth: 0,
    area: 0
  };

  @ViewChild('agGridProperty') agGridProperty!: AgGridAngular;
  @ViewChild('agGridSubSet') agGridSubSet!: AgGridAngular;
  @ViewChild('agGridPiece') agGridPiece!: AgGridAngular;

  title = 'Nuevo módulo';

  columnDefsProperties: any[] = [];
  columnDefsPiece: any[] = [];
  columnDefsSubSets: any[] = [];
  gridOptionsProperties: GridOptions;
  gridOptionsSubSets: GridOptions;
  gridOptionsPiece: GridOptions;

  loading: boolean = false;

  propertiesList = [{ property: '', value: '' }];
  subSetsList: any[] = [];
  pieceList: any[] = [];

  tagList: string[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  obj: ISet = {
    setId: '',
    name: '',
    reference: '',
    description: '',
    dimensions: this.dimensions,
    tags: '',
    sets: [],
    pieces: [],
    quantity: 1
  };

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

  constructor(
    private constructionLogisticsApi: ConstructionLogisticsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<GetSetComponent>
  ) {
    this.gridOptionsProperties = <GridOptions>{
      rowSelection: 'single',
      localeText: { noRowsToShow: 'No se encontraron registros...' }
    };

    this.gridOptionsSubSets = <GridOptions>{
      rowSelection: 'single',
      localeText: { noRowsToShow: 'No se encontraron registros...' }
    };

    this.gridOptionsPiece = <GridOptions>{
      rowSelection: 'single',
      localeText: { noRowsToShow: 'No se encontraron registros...' }
    };

    const { type, obj = {} } = data || {};
    console.log('obj>>', obj);
    console.log('obj>>', obj.dimensions);
    this.obj = obj;
    if (obj.setId) {
      this.title = `Editar Módulo '${obj.name}'`;
      this.tagList = split(obj.tags, ';');
      this.subSetsList = obj.sets;
      this.pieceList = obj.pieces;
      if (obj.dimensions) {
        this.dimensions = {
          height: +(obj.dimensions.height || 0),
          width: +(obj.dimensions.width || 0),
          depth: +(obj.dimensions.depth || 0),
          area: +(obj.dimensions.area || 0)
        };
      }
    }

    // if (this.obj) {
    //   //this.tagList = split(obj.tags, ';');
    //   this.dimensions = this.obj.dimensions;
    // }

    this.settingsInit();
  }

  ngOnInit(): void {}

  settingsInit = async () => {
    this.columnDefsProperties = [
      {
        headerName: 'Propiedad',
        field: 'property',
        filter: true,
        width: 300,
        editable: true,
        cellEditor: 'agTextCellEditor'
      },
      {
        headerName: 'Valor',
        field: 'value',
        filter: true,
        width: 300,
        editable: true
      },
      {
        groupId: 'DelProBtn',
        sortable: true,
        width: 50,
        suppressMenu: true,
        resizable: true,
        cellRenderer: this.delCellRenderer,
        tooltipValueGetter: function getTooltip() {
          return 'Eliminar';
        }
      }
    ];

    this.columnDefsSubSets = [
      { headerName: 'Nombre', field: 'name', filter: true },
      {
        headerName: 'Referencia',
        field: 'reference',
        filter: true,
        width: 160
      },
      {
        headerName: 'Dimensión',
        field: 'dimension',
        filter: true,
        width: 160,
        cellRenderer: this.dimensionCellRender
      },
      {
        headerName: 'Cantidad',
        field: 'cantidad',
        filter: true,
        width: 140,
        editable: true
      },
      {
        groupId: 'DelSModBtn',
        sortable: true,
        width: 50,
        suppressMenu: true,
        resizable: true,
        cellRenderer: this.delCellRenderer,
        tooltipValueGetter: function getTooltip() {
          return 'Eliminar';
        }
      }
    ];

    this.columnDefsPiece = [
      { headerName: 'Nombre', field: 'name', filter: true },
      {
        headerName: 'Referencia',
        field: 'reference',
        filter: true,
        width: 160
      },
      {
        headerName: 'Dimensión',
        field: 'dimension',
        filter: true,
        width: 160,
        cellRenderer: this.dimensionCellRender
      },
      {
        headerName: 'Cantidad',
        field: 'cantidad',
        filter: true,
        width: 140,
        editable: true
      },
      {
        groupId: 'DelPieceBtn',
        sortable: true,
        width: 50,
        suppressMenu: true,
        resizable: true,
        cellRenderer: this.delCellRenderer,
        tooltipValueGetter: function getTooltip() {
          return 'Eliminar';
        }
      }
    ];
  };

  onCellClicked(par: any) {
    if (par.colDef.groupId == 'DelProBtn') {
      this.delRow(par.data, 'delRowProperty');
    } else if (par.colDef.groupId == 'DelSModBtn') {
      this.delRow(par.data, 'delRowMod');
    } else if (par.colDef.groupId == 'DelPieceBtn') {
      this.delRow(par.data, 'delRowPiece');
    }
  }

  addRow() {
    this.propertiesList.push({ property: '', value: '' });
    this.agGridProperty.api.setRowData(this.propertiesList);
  }

  delRow(param: any, modo: string) {
    if (modo === 'delRowProperty') {
      console.log('param>>', param);
      console.log('this.propertiesList>>', this.propertiesList);
      this.propertiesList.splice(param.rowIndex, 1);
      console.log('this.propertiesList>>', this.propertiesList);
      this.agGridProperty.api.setRowData(this.propertiesList);
    } else if (modo === 'delRowMod') {
      this.subSetsList.splice(param.rowIndex, 1);
      this.agGridSubSet.api.setRowData(this.subSetsList);
    } else if (modo === 'delRowPiece') {
      this.pieceList.splice(param.rowIndex, 1);
      this.agGridPiece.api.setRowData(this.pieceList);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) this.tagList.push(value);
    event.chipInput!.clear();
  }

  removeTag(value: string): void {
    const index = this.tagList.indexOf(value);

    if (index >= 0) {
      this.tagList.splice(index, 1);
    }
  }

  openLibrary(type: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 'M',
      title: 'Angular For Beginners',
      viewMode: 'choosing',
      excludeType: type === 'set' ? ['piece', 'component'] : ['module']
    };
    dialogConfig.height = '450px';
    dialogConfig.width = '820px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetLibraryComponent, dialogConfig);
    // this.dialogRef.close({ ok: true });
    dialogRef.afterClosed().subscribe((data) => {
      if (data?.selected && data.obj.setId) {
        if (this.subSetsList != undefined) {
          this.subSetsList.push(data.obj);
          this.agGridSubSet.api.setRowData(this.subSetsList);
        } else {
          this.subSetsList = [];
          this.subSetsList.push(data.obj);
          this.agGridSubSet.api.setRowData(this.subSetsList);
        }
      } else if (data?.selected && data.obj.pieceId) {
        if (this.pieceList != undefined) {
          this.pieceList.push(data.obj);
          this.agGridPiece.api.setRowData(this.pieceList);
        } else {
          this.pieceList = [];
          this.pieceList.push(data.obj);
          this.agGridPiece.api.setRowData(this.pieceList);
        }
      }
    });
  }

  onSave = async () => {
    this.loading = true;
    const setTags = this.tagList.join(';');
    const { height, width, depth } = this.dimensions;
    const setsSelected: any[] = this.subSetsList ? this.subSetsList : [];
    const piecesSelected: any[] = this.pieceList ? this.pieceList : [];
    console.log(this.obj);
    let setObject = {
      ...this.obj,
      tags: setTags,
      dimensions: {
        height: +(height || 0),
        width: +(width || 0),
        depth: +(depth || 0),
        area: +(height || 0) * +(width || 0)
      },
      sets: setsSelected,
      pieces: piecesSelected
    };

    console.log(setObject);
    delete setObject['setId'];
    const result = isEmpty(this.obj.setId)
      ? await this.createSet(setObject)
      : await this.updateSet(this.obj.setId || '', setObject);
  };

  updateSet = async (setId: string, body: ISet) => {
    // console.log('updateSet function');
    const result = await this.constructionLogisticsApi.updateSet(setId, body);
    this.loading = false;
    this.toastr.success('Módulo actualizado con éxito');
    this.dialogRef.close({ ok: true });
  };

  createSet = async (body: ISet) => {
    // console.log('createSet function');
    const result = await this.constructionLogisticsApi.createSet(body);
    this.loading = false;
    this.toastr.success('Módulo creado con éxito');
    this.dialogRef.close({ ok: true });
  };
}
