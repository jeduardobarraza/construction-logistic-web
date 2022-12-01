import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
//import { I18Service } from 'src/app/services/i18.service';
import { get, set } from 'lodash';
import { ColDef } from 'ag-grid-community';
//import CommonCells from 'src/app/utils/common-cell';
import { AgGridAngular } from 'ag-grid-angular';
import TableHelper from 'src/app/utils/helpers/tables-helper';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { GetSetComponent } from './get-set/get-set.component';
import { GetPieceComponent } from './get-piece/get-piece.component';
import { GetComponentComponent } from './get-component/get-component.component';
import { ApiHelperService } from '../../../services/api-helper.service';
import { TransitionCheckState } from '@angular/material/checkbox';

@Component({
  selector: 'app-get-library',
  templateUrl: './get-library.component.html',
  styleUrls: ['./get-library.component.scss']
})
export class GetLibraryComponent implements AfterViewInit {
  listTypeByTabIndex: string[] = ['module', 'piece', 'component'];
  listByType = {
    piece: {
      loaded: false,
      data: []
    },
    component: {
      loaded: false,
      data: []
    }
  };

  public loading = false;

  pieceTableData: any[] = [];
  setTableData: any[] = [];

  columnDefsSet: any[] = [];
  columnDefsPiece: any[] = [];
  columnDefsComponent: any[] = [];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  setList: any[] = [];
  // For accessing the Grid's API
  @ViewChild('setGrid') setGrid!: AgGridAngular;
  @ViewChild('pieceGrid') pieceGrid!: AgGridAngular;
  @ViewChild('componentGrid') componentGrid!: AgGridAngular;
  hidePieces = false;
  viewMode = '';
  excludeType: string[] = [];
  Id = 'O';
  CHOOSING_MODE = 'choosing';

  tableColumns = {
    projectsTable: {
      tlProjectName: 'Obra',
      tlClientName: 'Nombre cliente',
      articles: 'Artículos',
      responsible: 'Diseño'
    },
    setsTable: {
      name: 'Nombre',
      reference: 'Referencia',
      dimension: 'Dimensiones',
      tags: 'Etiqueta(s)'
    },
    piecesTable: {
      name: 'Nombre',
      reference: 'Referencia',
      dimensions: 'Dimensiones',
      tags: 'Etiqueta(s)'
    },
    modulesTable: {}
  };

  constructor(
    private api: ConstructionLogisticsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<GetLibraryComponent>
  ) {
    this.hidePieces = data?.hidePieces;
    this.viewMode = data?.viewMode || '';
    this.excludeType = data?.excludeType;
    this.Id = data.id;
  }

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.buildTableColumns();
      if (this.mustShowTab(this.listTypeByTabIndex[0])) await this.loadSets();
      else if (this.mustShowTab(this.listTypeByTabIndex[1]))
        await this.loadPiecesByType('piece');
      else if (this.mustShowTab(this.listTypeByTabIndex[2]))
        await this.loadPiecesByType('component');
    });
  }

  buildTableColumns = async () => {
    await Promise.all([
      this.buildSetTableColumns(),
      this.buildPieceTableColumns(),
      this.buildComponentTableColumns()
    ]);
  };

  mustShowTab = (type: string) => !this.excludeType?.includes(type);

  buildSetTableColumns = async () => {
    const setFields = ['name', 'reference', 'dimension', 'tags'];

    const tableColumnsProperties = {
      name: {
        ...this.defaultColDef,
        width: 350
      },
      reference: {
        ...this.defaultColDef,
        width: 120
      },
      dimension: {
        ...this.defaultColDef
      },
      tags: {
        ...this.defaultColDef,
        width: 250
      }
    };

    const columnDefs: ColDef[] = await TableHelper.getFieldsColumns(
      setFields,
      tableColumnsProperties
    );
    if (this.viewMode === 'choosing') {
      const chooseColumn = TableHelper.getActionColumn('choose', 'downloading');
      columnDefs.push(chooseColumn);
    } else {
      const editColumn = TableHelper.getEditColumn();
      console.log('*****', editColumn);
      columnDefs.push(editColumn);
      columnDefs.push(TableHelper.getDeleteColumn());
    }
    this.columnDefsSet = columnDefs;
    //console.log(this.Id);
    // if (this.Id == 'M') {
    // }
  };

  buildPieceTableColumns = async () => {
    const pieceFields = ['name', 'reference', 'dimension', 'tags'];
    const tableColumnsPropertiesPieces = {
      name: {
        ...this.defaultColDef,
        width: 350
      },
      reference: {
        ...this.defaultColDef,
        width: 120
      },
      dimension: {
        ...this.defaultColDef
      },
      tags: {
        ...this.defaultColDef,
        width: 250
      }
    };

    const columnDefs: ColDef[] = await TableHelper.getFieldsColumns(
      pieceFields,
      tableColumnsPropertiesPieces
    );
    if (this.viewMode === 'choosing') {
      const chooseColumn = TableHelper.getActionColumn('choose', 'downloading');
      columnDefs.push(chooseColumn);
    } else {
      const editColumn = TableHelper.getEditColumn();
      console.log('*****', editColumn);
      columnDefs.push(editColumn);
      columnDefs.push(TableHelper.getDeleteColumn());
    }
    this.columnDefsPiece = columnDefs;
  };

  buildComponentTableColumns = async () => {
    const componentFields = ['name', 'reference', 'dimension', 'tags'];
    const tableColumnsPropertiesComponents = {
      name: {
        ...this.defaultColDef,
        width: 350
      },
      reference: {
        ...this.defaultColDef,
        width: 120
      },
      dimension: {
        ...this.defaultColDef
      },
      tags: {
        ...this.defaultColDef,
        width: 250
      }
    };

    const columnDefs: ColDef[] = await TableHelper.getFieldsColumns(
      componentFields,
      tableColumnsPropertiesComponents
    );
    if (this.viewMode === 'choosing') {
      const chooseColumn = TableHelper.getActionColumn('choose', 'downloading');
      columnDefs.push(chooseColumn);
    } else {
      const editColumn = TableHelper.getEditColumn();
      console.log('*****', editColumn);
      columnDefs.push(editColumn);
      columnDefs.push(TableHelper.getDeleteColumn());
    }
    this.columnDefsComponent = columnDefs;
  };

  loadPiecesByType = async (type = '', hardRefreshing = false) => {
    const pieceTypeObject = get(this.listByType, type, { loaded: false });
    const mustRefreshData = hardRefreshing || !pieceTypeObject.loaded;
    if (!mustRefreshData) return;

    this.loading = true;
    const data = await this.api.getPiecesByType(type);
    set(this.listByType, type, { data, loaded: true });
    const gridId = type + 'Grid';
    const gridApiElement = get(this, gridId);

    if (gridApiElement) {
      gridApiElement.api.setRowData(data);
      gridApiElement.api.sizeColumnsToFit();
    }

    this.loading = false;
  };

  loadSets = async () => {
    this.setList = [];
    this.loading = true;
    this.setGrid.api.setRowData([]);
    const setsList = await this.api.getSetsList();
    this.setGrid.api.setRowData(setsList);
    this.setGrid.api.sizeColumnsToFit();
    this.loading = false;
    this.setList = setsList;
  };

  onTabChanged(event: any) {
    console.log('event>>>', event);
    const type = event?.tab?.textLabel;
    if (type !== 'module') {
      this.loadPiecesByType(type);
    }
  }

  onSetCellClicked = (event: any = null) => {
    console.log('>>>', event);
    if (!event) return;
    const {
      data,
      colDef: { colId }
    } = event;
    if (colId === 'btnEdit') this.getSet(data);
    if (colId === 'choose') this.selectedSet(data.type, data);
    if (colId === 'btnDelete') this.deleteSet(data.setId);
  };

  onPieceCellClicked = (event: any = null) => {
    console.log('>>>', event);
    if (!event) return;
    const {
      data,
      colDef: { colId }
    } = event;
    if (colId === 'btnEdit') this.getPiece(data);
    if (colId === 'choose') this.selectComponent(data.type, data);
    if (colId === 'btnDelete') this.deletePiece(data.pieceId, data.type);
  };

  onComponentCellClicked = (event: any = null) => {
    console.log('>>>', event);
    if (!event) return;
    const {
      data,
      colDef: { colId }
    } = event;
    if (colId === 'btnEdit') this.getComponent(data);
    if (colId === 'choose') this.selectComponent(data.type, data);
    if (colId === 'btnDelete') this.deletePiece(data.pieceId, data.type);
  };

  getSet = async (obj: any = {}) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { obj };
    dialogConfig.height = '520px';
    dialogConfig.width = '820px';
    dialogConfig.panelClass = 'custom-modal';
    this.dialog
      .open(GetSetComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.loadSets();
      });
    //console.log('Hola');
  };

  getPiece = (obj: any = {}) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { obj };

    dialogConfig.height = '520px';
    dialogConfig.width = '820px';
    dialogConfig.panelClass = 'custom-modal';
    this.dialog
      .open(GetPieceComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.loadPiecesByType('piece', true);
      });
  };

  getComponent = (obj: any = {}) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { obj };

    dialogConfig.height = '520px';
    dialogConfig.width = '820px';
    dialogConfig.panelClass = 'custom-modal';
    this.dialog
      .open(GetComponentComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.loadPiecesByType('component', true);
      });
  };

  selectedSet(setId: string, obj: any) {
    this.dialogRef.close({ selected: true, obj });
  }

  selectComponent(type: string, obj: any) {
    this.dialogRef.close({ selected: true, obj });
  }

  async deletePiece(pieceId: string, type: string) {
    await this.api.deletePiece(pieceId);
    this.loading = false;
    this.loadPiecesByType(type, true);
  }

  async deleteSet(setId: string) {
    await this.api.deleteSet(setId);
    this.loading = false;
    this.loadSets();
  }
}
