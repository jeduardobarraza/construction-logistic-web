import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { map, Observable, of, startWith } from 'rxjs';
import { isEmpty, split } from 'lodash';
import { TaskLeverCoreService } from 'src/app/services/task-lever-core.service';
import { ApiHelperService } from '../../../services/api-helper.service';
import { ConstructionLogisticsService } from '../../../services/construction-logistics.service';
import { AngularMaterialModule } from '../../../modules/angular-material.module';
import { SaleUnitComponent } from './sale-unit/sale-unit.component';
import { AgGridAngular } from 'ag-grid-angular';
import { ISaleUnit } from 'src/app/interfaces/saleUnit.interface';
import { IConstruction } from '../../../interfaces/construction.interface';
import { DefaultTitleStrategy } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-project',
  templateUrl: './get-project.component.html',
  styleUrls: ['./get-project.component.scss']
})
export class GetProjectComponent implements OnInit {
  clientListControl = new FormControl('');
  stateListControl = new FormControl('');
  filteredOptions: Observable<any[]> = new Observable<any[]>();
  loading: boolean = false;
  productGroupsList: any[] = [];
  tittle = 'Nueva Obra';

  @ViewChild('agGridSubSet') agGridSubSet!: AgGridAngular;
  @ViewChild('agGridPiece') agGridPiece!: AgGridAngular;

  saleUnit: ISaleUnit = {
    name: '',
    reference: '',
    description: '',
    group: '',
    supplyValue: '',
    installValue: '',
    dimensions: {
      height: undefined,
      width: undefined,
      depth: undefined,
      area: undefined
    },
    sets: [],
    pieces: [],
    quantity: 1
  };

  obj: IConstruction = {
    projectId: '',
    responsibleId: 0,
    responsible: '',
    tlClientId: 0,
    tlClientName: '',
    tlProjectId: 'Latelier',
    tlProjectName: '',
    tlProjectAddress: '',
    tlProjectEmails: '',
    tlConfirmationNumber: '',
    userName: '',
    status: '',
    articles: '',
    detail: []
  };

  clientList: any[] = [];
  projectList: any[] = [];
  group: string = '';
  user: number;
  users: any[] = [];
  saleUnitList: ISaleUnit[] = [this.saleUnit];
  articles: string[] = [];
  groupList = [
    { id: 'P', group: 'Puertas', value: 'Door', checked: true },
    { id: 'C', group: 'Closets', value: 'Closet' },
    { id: 'K', group: 'Cocinas', value: 'Cuisine' },
    { id: 'B', group: 'Baños', value: 'Bath' },
    { id: 'O', group: 'Otros', value: 'Other' }
  ];

  stateList = [
    { id: '0', status: 'Puertas', value: 'Door' },
    { id: '1', status: 'Closets', value: 'Closet' },
    { id: '2', status: 'Cocinas', value: 'Cuisine' }
  ];

  componentDoor: any[] = [];
  componentCloset: any[] = [];
  componentCuisine: any[] = [];
  componentBath: any[] = [];
  componentOther: any[] = [];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<GetProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public constructionLogisticApi: ConstructionLogisticsService,
    public taskLeverCoreApi: TaskLeverCoreService,
    private toastr: ToastrService
  ) {
    this.user = data.usuario;
    this.users = data.usuarios;

    const { obj } = data || {};

    if (obj) {
      this.obj = obj;
      this.articles = obj.articles.split(', ');
      this.groupList[0].checked = false;
      // for (let i = 0; i < this.articles.length; i++) {
      //   for (let j = 0; j < this.groupList.length; j++) {
      //     if (this.articles[i] == this.groupList[j].group)
      //       this.groupList[j].checked = true;
      //   }
      // }

      for (let i = 0; i < obj.detail.length; i++) {
        if (obj.detail[i].group == 'Puertas') {
          this.groupList[0].checked = true;
          if (this.componentDoor.length < 1) {
            this.addDoorItem(0);
            this.componentDoor[0] = obj.detail[i];
          } else {
            let j = this.componentDoor.length;
            this.addDoorItem(j);
            this.componentDoor[j] = obj.detail[i];
          }
        } else if (obj.detail[i].group == 'Closets') {
          this.groupList[1].checked = true;
          if (this.componentCloset.length < 1) {
            this.addClosetItem(0);
            this.componentCloset[0] = obj.detail[i];
          } else {
            let j = this.componentCloset.length;
            this.addClosetItem(j);
            this.componentCloset[j] = obj.detail[i];
          }
        } else if (obj.detail[i].group == 'Cocinas') {
          this.groupList[2].checked = true;
          if (this.componentCuisine.length < 1) {
            this.addCuisineItem(0);
            this.componentCuisine[0] = obj.detail[i];
          } else {
            let j = this.componentCuisine.length;
            this.addCuisineItem(j);
            this.componentCuisine[j] = obj.detail[i];
          }
        } else if (obj.detail[i].group == 'Baños') {
          this.groupList[3].checked = true;
          if (this.componentBath.length < 1) {
            this.addBathItem(0);
            this.componentBath[0] = obj.detail[i];
          } else {
            let j = this.componentBath.length;
            this.addBathItem(j);
            this.componentBath[j] = obj.detail[i];
          }
        } else if (obj.detail[i].group == 'Otros') {
          this.groupList[4].checked = true;
          if (this.componentBath.length < 1) {
            this.addOtherItem(0);
            this.componentOther[0] = obj.detail[i];
          } else {
            let j = this.componentOther.length;
            this.addOtherItem(j);
            this.componentOther[j] = obj.detail[i];
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.getClients();
    if (this.obj.projectId) {
      if (!this.groupList[0].checked) this.addDoorItem(0);
      if (!this.groupList[1].checked) this.addClosetItem(0);
      if (!this.groupList[2].checked) this.addCuisineItem(0);
      if (!this.groupList[3].checked) this.addBathItem(0);
      if (!this.groupList[4].checked) this.addOtherItem(0);
    } else {
      this.addDoorItem(0);
      this.addClosetItem(0);
      this.addCuisineItem(0);
      this.addBathItem(0);
      this.addOtherItem(0);
    }
    // this.filteredOptions = this.clientListControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value || ''))
    // );
    // this.filteredOptions = this.projectListControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => this._filter(value || ''))
    // );
  }

  getClients = async () => {
    const clientList =
      await this.taskLeverCoreApi.getClientsWithConfirmations();
    this.clientList = clientList;
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.clientList.filter((client) =>
      client?.nombre_completo.toLowerCase().includes(filterValue)
    );
  }

  // getProjects = async () => {
  //   const projectList = await this.constructionLogisticApi.getProjects();

  //   this.projectList = projectList;
  //   console.log(this.projectList);
  // };

  saveProjectObra() {
    return null;
  }

  isSelect(furniture: string) {
    return (
      this.groupList.find((x) => x.checked && x.group == furniture) != null
    );
  }

  addDoorItem(index: number) {
    let saleUnit = {
      name: '',
      reference: '',
      description: '',
      group: 'Puertas',
      supplyValue: '',
      installValue: '',
      dimensions: {
        height: undefined,
        width: undefined,
        depth: undefined,
        area: undefined
      },
      sets: [],
      pieces: [],
      quantity: 1
    };
    this.componentDoor.splice(index + 1, 0, saleUnit);
  }

  removeDoorItem(index: number) {
    this.componentDoor.splice(index, 1);
  }

  addClosetItem(index: number) {
    let saleUnit = {
      name: '',
      reference: '',
      description: '',
      group: 'Closets',
      supplyValue: '',
      installValue: '',
      dimensions: {
        height: undefined,
        width: undefined,
        depth: undefined,
        area: undefined
      },
      sets: [],
      pieces: [],
      quantity: 1
    };
    this.componentCloset.splice(index + 1, 0, saleUnit);
  }

  removeClosetItem(index: number) {
    this.componentCloset.splice(index, 1);
  }

  addCuisineItem(index: number) {
    let saleUnit = {
      name: '',
      reference: '',
      description: '',
      group: 'Cocinas',
      supplyValue: '',
      installValue: '',
      dimensions: {
        height: undefined,
        width: undefined,
        depth: undefined,
        area: undefined
      },
      sets: [],
      pieces: [],
      quantity: 1
    };
    this.componentCuisine.splice(index + 1, 0, saleUnit);
  }

  removeCuisineItem(index: number) {
    this.componentCuisine.splice(index, 1);
  }

  addBathItem(index: number) {
    let saleUnit = {
      name: '',
      reference: '',
      description: '',
      group: 'Baños',
      supplyValue: '',
      installValue: '',
      dimensions: {
        height: undefined,
        width: undefined,
        depth: undefined,
        area: undefined
      },
      sets: [],
      pieces: [],
      quantity: 1
    };
    this.componentBath.splice(index + 1, 0, saleUnit);
  }

  removeBathItem(index: number) {
    this.componentBath.splice(index, 1);
  }

  addOtherItem(index: number) {
    let saleUnit = {
      name: '',
      reference: '',
      description: '',
      group: 'Otros',
      supplyValue: '',
      installValue: '',
      dimensions: {
        height: undefined,
        width: undefined,
        depth: undefined,
        area: undefined
      },
      sets: [],
      pieces: [],
      quantity: 1
    };
    this.componentOther.splice(index + 1, 0, saleUnit);
  }

  removeOtherItem(index: number) {
    this.componentOther.splice(index, 1);
  }

  modules(value: string, index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (value == 'Door') {
      dialogConfig.data = {
        id: 1,
        title: 'Puertas',
        sets: this.componentDoor[index].sets,
        pieces: this.componentDoor[index].pieces
      };
    } else if (value == 'Closet') {
      dialogConfig.data = {
        id: 1,
        title: 'Closets',
        sets: this.componentCloset[index].sets,
        pieces: this.componentCloset[index].pieces
      };
    } else if (value == 'Cuisine') {
      dialogConfig.data = {
        id: 1,
        title: 'Cocinas',
        sets: this.componentCuisine[index].sets,
        pieces: this.componentCuisine[index].pieces
      };
    } else if (value == 'Bath') {
      dialogConfig.data = {
        id: 1,
        title: 'Baño',
        sets: this.componentBath[index].sets,
        pieces: this.componentBath[index].pieces
      };
    } else if (value == 'Other') {
      dialogConfig.data = {
        id: 1,
        title: 'Otros',
        sets: this.componentOther[index].sets,
        pieces: this.componentOther[index].pieces
      };
    }
    console.log(dialogConfig.data);
    dialogConfig.height = '600px';
    dialogConfig.width = '1100px';
    dialogConfig.panelClass = 'custom-modal';
    const dialogRef = this.dialog.open(SaleUnitComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      if (data?.selected) {
        console.log(data.obj);
        if (data.obj.group == 'Puertas') {
          this.componentDoor[index].sets = data.obj.sets;
          this.componentDoor[index].pieces = data.obj.pieces;
          this.componentDoor[index].group = data.obj.group;
        }
        if (data.obj.group == 'Closets') {
          this.componentCloset[index].sets = data.obj.sets;
          this.componentCloset[index].pieces = data.obj.pieces;
          this.componentCloset[index].group = data.obj.group;
        }
        if (data.obj.group == 'Cocinas') {
          this.componentCuisine[index].sets = data.obj.sets;
          this.componentCuisine[index].pieces = data.obj.pieces;
          this.componentCuisine[index].group = data.obj.group;
        }
        if (data.obj.group == 'Baño') {
          this.componentBath[index].sets = data.obj.sets;
          this.componentBath[index].pieces = data.obj.pieces;
          this.componentBath[index].group = data.obj.group;
        }
        if (data.obj.group == 'Otros') {
          this.componentOther[index].sets = data.obj.sets;
          this.componentOther[index].pieces = data.obj.pieces;
          this.componentOther[index].group = data.obj.group;
        }
      }
      console.log(this.componentDoor);
      console.log(this.componentCloset);
      console.log(this.componentCuisine);
      console.log(this.componentBath);
      console.log(this.componentOther);
    });
  }

  findArticles() {
    let articles = '';
    for (let group of this.groupList) {
      if (group.checked == true) {
        if (articles.length > 1) articles = articles + ', ' + group.group;
        else articles = group.group;
      }
    }
    return articles;
  }

  saleUnitSelected() {
    let details: any[] = [];
    if (
      this.groupList[0].checked == true &&
      this.componentDoor[0].name.length > 1
    )
      details = details.concat(this.componentDoor);
    if (
      this.groupList[1].checked == true &&
      this.componentCloset[0].name.length > 1
    )
      details = details.concat(this.componentCloset);
    if (
      this.groupList[2].checked == true &&
      this.componentCuisine[0].name.length > 1
    )
      details = details.concat(this.componentCuisine);
    if (
      this.groupList[3].checked == true &&
      this.componentBath[0].name.length > 1
    )
      details = details.concat(this.componentBath);
    if (
      this.groupList[4].checked == true &&
      this.componentOther[0].name.length > 1
    )
      details = details.concat(this.componentOther);
    return details;
  }

  onSave() {
    this.loading = true;
    const articleSelected = this.findArticles();
    const saleUnitSelected = this.saleUnitSelected();
    for (let i = 0; i < this.clientList.length; i++) {
      if (this.obj.tlClientName == this.clientList[i].nombre_completo)
        this.obj.tlClientId = this.clientList[i].id;
    }
    let projectObject = {
      ...this.obj,
      articles: articleSelected,
      detail: saleUnitSelected
    };
    console.log(projectObject);
    //delete projectObject['projectId'];
    const result = isEmpty(this.obj.projectId)
      ? this.createProject(projectObject)
      : this.updateProject(this.obj.projectId, projectObject);
  }

  updateProject = async (projectId: string, body: IConstruction) => {
    const result = await this.constructionLogisticApi.updateProject(
      projectId,
      body
    );
    this.loading = false;
    this.dialogRef.close({ ok: true });
    window.location.reload();
  };

  createProject = async (body: IConstruction) => {
    const result = await this.constructionLogisticApi.createProject(body);
    this.loading = false;
    this.dialogRef.close({ ok: true });
    this.toastr.success('Proyecto creado satisfactoriamente');
    window.location.reload();
  };
}
