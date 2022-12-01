import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { get } from 'lodash';
import CommonCells from 'src/app/utils/common-cell';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ConstructionLogisticsComponent } from './construction-logistics/construction-logistics.component';
import { GetProjectComponent } from './get-project/get-project.component';
export interface DialogData {
  projectId: string;
  confirm: boolean;
  Name: string;
}
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit {
  public loading = true;

  public columnDefs: ColDef[] = [];
  confirm: boolean = false;

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  tableColumnsProperties = {
    projectId: {
      ...this.defaultColDef
    },
    projectName: {
      ...this.defaultColDef
    },
    articles: {
      ...this.defaultColDef
    },
    responsible: {
      ...this.defaultColDef
    }
  };

  invoiceHistoryTooltip = 'Histórico de Facturas';

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

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
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    setTimeout(async () => {
      await this.buildTableColumns();
      await this.loadProjects();
    });
  }

  // Example of consuming Grid Event
  onCellClicked(e: any) {
    //this.loading = true;
    console.log('cellClicked', e);
    if (!e) return;
    const {
      data,
      colDef: { colId }
    } = e;
    // if (colId === 'btnEdit') this.getSet(data);
    // if (colId === 'choose') this.selectedSet(data.type, data);
    if (colId === 'btnDelete')
      this.openDialog('100ms', '50ms', data.projectId, data.tlProjectName);
    if (e.colDef.colId === 'btnLogistic') {
      this.logisticProject(e.data.type, e.data);
    }
    if (
      e.colDef.colId != 'btnLogistic' &&
      e.colDef.colId != 'btnArchive' &&
      e.colDef.colId != 'btnDelete'
    ) {
      this.editProject(e.data);
    }
  }

  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  buildTableColumns = async () => {
    const fields = ['tlProjectName', 'tlClientName', 'articles', 'responsible'];
    const columnDefs: ColDef[] = [];

    await fields.map(async (field) => {
      const headerName = get(this.tableColumns.projectsTable, field);
      // const headerName = await this.i18.t(
      //   `tableColumns.projectsTable.${field}`
      // );
      const columnProperties = get(this.tableColumnsProperties, field, {});
      const column = {
        ...columnProperties,
        colId: field,
        headerName,
        field
      };
      columnDefs.push(column);
    });

    const logisticColumn = {
      colId: 'btnLogistic',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.logisticCellRenderer,
      tooltipValueGetter: function getTooltip() {
        return 'constructionLogistic';
      }
    };
    columnDefs.push(logisticColumn);

    const archiveColumn = {
      colId: 'btnArchive',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.archiveCellRenderer,
      tooltipValueGetter: function getTooltip() {
        return 'file';
      }
    };
    columnDefs.push(archiveColumn);

    const deleteColumn = {
      colId: 'btnDelete',
      sortable: true,
      width: 48,
      resizable: true,
      cellRenderer: CommonCells.deleteCellRenderer,
      tooltipValueGetter: function getTooltip() {
        return 'delete';
      }
    };
    columnDefs.push(deleteColumn);
    this.columnDefs = columnDefs;
  };

  loadProjects = async () => {
    const projectsList = await this.api.getProjects();
    this.agGrid.api.setRowData(projectsList);
    this.loading = false;
  };

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    projectID: string,
    projectName: string
  ): void {
    const dialogRef = this.dialog.open(DialogAnimations, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { projectId: projectID, confirm: this.confirm, Name: projectName }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(result);
      //console.log(this.confirm);
      if (result.confirm == true) this.deleteProject(result.projectId);
    });
  }

  async deleteProject(projectId: string) {
    await this.api.deleteProject(projectId);
    window.location.reload();
    this.loading = false;
  }

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

  editProject = async (obj: any = null) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      obj
    };

    dialogConfig.height = '750px';
    dialogConfig.width = '1800px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(GetProjectComponent, dialogConfig);
  };
}

@Component({
  selector: 'dialog-animations',
  templateUrl: 'dialog-animations.html'
})
export class DialogAnimations {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimations>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirmClick(): void {
    this.data.confirm = true;
    // console.log(this.data);
    this.dialogRef.close(this.data);
  }
  onNoClick(): void {
    this.dialogRef.close(this.data);
  }
}
