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
import { isEmpty, split } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { GetLibraryComponent } from '../get-library.component';
import { IPiece } from '../../../../interfaces/piece.interface';
import { IProperty } from 'src/app/interfaces/property.interface';

@Component({
  selector: 'app-get-modulo',
  templateUrl: './get-piece.component.html',
  styleUrls: ['./get-piece.component.scss']
})
export class GetPieceComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGridProperty') agGridProperty!: AgGridAngular;

  title = 'Nueva Pieza';

  loading: boolean = false;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  dimensions = {
    height: 0,
    width: 0,
    depth: 0,
    area: 0
  };

  obj: IPiece = {
    pieceId: '',
    name: '',
    reference: '',
    dimensions: this.dimensions,
    type: 'piece',
    tags: '',
    properties: [{ property: '', value: '' }],
    quantity: 1
  };

  validate: boolean = false;
  tagList: string[] = [];

  delCellRenderer = function () {
    let html = "<span style='font-size:21px; color:goldenrod;'>&#9733;</span>";
    return `<mat-icon class="mat-icon material-icons" style="color:#dc3545;cursor:pointer;" role="img" aria-hidden="true">clear</mat-icon>`;
  };

  gridOptionsPieza: GridOptions;
  columnDefsPieza: any[] = [];
  propertiesList = [{ property: '', value: '' }];

  constructor(
    private constructionLogisticsApi: ConstructionLogisticsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<GetPieceComponent>
  ) {
    this.gridOptionsPieza = <GridOptions>{
      rowSelection: 'single',
      localeText: { noRowsToShow: 'No se encontraron registros...' }
    };

    const { type, obj } = data || {};
    this.obj['type'] = type;

    this.title = `${
      obj.pieceId ? `Editar pieza '${obj.name}'` : 'Nueva pieza'
    }`;
    if (obj.pieceId) {
      this.obj = obj;
      this.tagList = split(obj.tags, ';');
      if (obj.properties) this.propertiesList = obj.properties;
      if (obj.dimensions) {
        this.dimensions = {
          height: +(obj.dimensions.height || 0),
          width: +(obj.dimensions.width || 0),
          depth: +(obj.dimensions.depth || 0),
          area: +(obj.dimensions.area || 0)
        };
      }
    }
    this.validation();
    this.settingsInit();
  }

  async validation() {
    if (this.obj.pieceId) {
      this.validate = await this.constructionLogisticsApi.validatePieceInUse(
        this.obj.pieceId
      );
    }
  }

  settingsInit = async () => {
    this.columnDefsPieza = [
      {
        headerName: 'Propiedad',
        field: 'property',
        filter: true,
        width: 250,
        editable: true
      },
      {
        headerName: 'Parámetro',
        field: 'value',
        filter: true,
        width: 250,
        editable: true
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
  };

  onCellClicked(par: any) {
    if (par.colDef.groupId == 'DelBtn') {
      this.delRow(par);
    }
  }

  ngOnInit(): void {}

  addRow() {
    this.propertiesList.push({ property: '', value: '' });
    this.agGridProperty.api.setRowData(this.propertiesList);
  }

  delRow(param: any) {
    console.log('param>>', param);
    console.log('this.propertiesList>>', this.propertiesList);
    this.propertiesList.splice(param.rowIndex, 1);
    console.log('this.propertiesList>>', this.propertiesList);
    this.agGridProperty.api.setRowData(this.propertiesList);
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

  disabledSaveButton = () => {
    return (
      isEmpty(this.obj.name) ||
      isEmpty(this.obj.reference) ||
      +(this.obj.dimensions.height || 0) <= 0 ||
      +(this.obj.dimensions.width || 0) <= 0 ||
      +(this.obj.dimensions.depth || 0) <= 0
    );
  };

  onSave = async () => {
    this.loading = true;
    const pieceTags = this.tagList.join(';');
    const { height, width, depth } = this.dimensions;
    const [{ property, value }] = this.propertiesList;
    let pieceObject = {
      ...this.obj,
      tags: pieceTags,
      dimensions: {
        height: +(height || 0),
        width: +(width || 0),
        depth: +(depth || 0),
        area: +(height || 0) * +(width || 0)
      },
      properties: [{ property, value }],
      type: 'piece'
    };
    console.log(pieceObject);
    delete pieceObject['pieceId'];
    const result = isEmpty(this.obj.pieceId)
      ? await this.createPiece(pieceObject)
      : await this.updatePiece(this.obj.pieceId || '', pieceObject);
  };

  createPiece = async (body: IPiece) => {
    await this.constructionLogisticsApi.createPiece(body);
    this.loading = false;
    this.toastr.success('Pieza creada con éxito');
    this.dialogRef.close({ ok: true });
  };

  updatePiece = async (pieceId: string, body: IPiece) => {
    await this.constructionLogisticsApi.updatePiece(pieceId, body);
    this.loading = false;
    this.toastr.success('Pieza actualizada con éxito');
    this.dialogRef.close({ ok: true });
  };

  createProperties = async (propertyId: string, body: IProperty) => {
    await this.constructionLogisticsApi.createProperty;
  };

  openLibrary() {
    console.log('openLibrary');
  }
}
