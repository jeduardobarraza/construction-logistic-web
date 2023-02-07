import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { IProjectRoute } from 'src/app/interfaces/projectRoute.interface';
import { ConstructionLogisticsService } from 'src/app/services/construction-logistics.service';
import { ConstructionLogisticsComponent } from '../construction-logistics.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-get-contract',
  templateUrl: './get-contract.component.html',
  styleUrls: ['./get-contract.component.scss']
})
export class GetContractComponent implements OnInit {
  locationsRoute: any[] = [];
  locationsListRoute: any[] = [];
  locationsQuantityRoute: any[] = [];
  saleUnitsTitles: any[] = [];
  saleUnitsList: any[] = [];
  totalsRoute: any[] = [];
  routeSelected: string = '';
  totalsToRegistry: any[] = [];
  obj: any = {};
  route: IProjectRoute = {
    routeId: '',
    projectId: '',
    projectName: '',
    routeNumber: '',
    routeDate: '',
    detail: []
  };
  name = 'ExcelSheet.xlsx';
  constructor(
    public dialogRef: MatDialogRef<ConstructionLogisticsComponent>,
    private api: ConstructionLogisticsService,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log(data);
    const { obj } = data || {};
    console.log('obj>>', obj);
    this.obj = obj;
    if (obj) {
      this.transformSalesUnitView();
      this.listRoutes();
    }
  }

  ngOnInit(): void {}

  listRoutes = async () => {
    console.log('listRoute Function>>>>>>');
    this.locationsQuantityRoute = [];
    this.locationsRoute = [];
    this.route.detail = [];
    this.route.routeId = '';
    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        this.locationsQuantityRoute.push(saleUnit);
      }
    }

    this.locationsListRoute = await this.api.getProjectRoute(
      this.obj.projectId
    );
    console.log(this.locationsListRoute);
    if (this.locationsListRoute.length > 0) {
      for (let route of this.locationsListRoute) {
        console.log(route);
        if (route.projectId == this.obj.projectId) {
          this.route.routeId = route.routeId;
          for (let detail of route.detail) {
            this.locationsRoute.push(detail);
          }
        }
      }
    }
    this.locationsRoute = [{ location: '', saleUnits: [] }];
    this.route.detail = this.locationsRoute;
    let condition: boolean = false;
    for (let i = 0; i < this.locationsQuantityRoute.length; i++) {
      for (let j = 0; j < this.locationsRoute.length; j++) {
        condition = false;
        for (let k = 0; k < this.locationsRoute[j].saleUnits.length; k++) {
          if (
            this.locationsQuantityRoute[i].name ==
            this.locationsRoute[j].saleUnits[k].name
          ) {
            condition = true;
          }
        }
        if (condition == false) {
          this.locationsRoute[j].saleUnits.push({
            quantity: 0,
            saleUnit: this.locationsQuantityRoute[i]
          });
        }
      }
    }
    this.consolidateRoute();
  };

  consolidateRoute() {
    console.log('updateRoute function');
    this.totalsRoute = cloneDeep(this.locationsRoute[0].saleUnits);
    this.totalsToRegistry = cloneDeep(this.locationsRoute[0].saleUnits);
    this.totalsRoute.map((saleUnit: any) => {
      saleUnit.quantity = 0;
    });
    this.totalsToRegistry.map((saleUnit: any) => {
      saleUnit.quantity = 0;
    });
    console.log(this.totalsToRegistry);

    for (let location of this.locationsRoute) {
      for (let i = 0; i < location.saleUnits.length; i++) {
        if (location.saleUnits[i].quantity > 0) {
          this.totalsRoute[i].quantity += location.saleUnits[i].quantity;
        }
      }
    }

    for (let saleUnitTitle of this.saleUnitsTitles) {
      for (let saleUnit of this.saleUnitsList[saleUnitTitle]) {
        console.log(saleUnit);
        for (let i = 0; i < this.totalsRoute.length; i++) {
          if (this.totalsRoute[i].saleUnit.name == saleUnit.name) {
            this.totalsToRegistry[i].quantity =
              saleUnit.quantity - this.totalsRoute[i].quantity;
          }
        }
      }
    }
    console.log(this.totalsRoute);
    console.log(this.totalsToRegistry);
    console.log(this.saleUnitsTitles);
  }

  onSave() {
    console.log('save Function');
  }

  transformSalesUnitView = () => {
    const groupedSalesUnit: any = {};
    (this.obj?.detail || []).map((saleUnit: any) => {
      if (!groupedSalesUnit[saleUnit.group])
        groupedSalesUnit[saleUnit.group] = [];
      groupedSalesUnit[saleUnit.group].push(saleUnit);
    });

    this.saleUnitsList = groupedSalesUnit;
    this.saleUnitsTitles = Object.keys(groupedSalesUnit).sort();
    console.log('saleUnitsList>>>', this.saleUnitsList);
    console.log('saleUnitsTitles>>>>', this.saleUnitsTitles);
  };

  exportToExcel(): void {
    let element = document.getElementById('Recorridos');
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.locationsListRoute
    );

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Recorridos');

    XLSX.writeFile(book, this.name);
  }
}
