import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IContractor } from '../../../../interfaces/contractor.interface';
import { ConstructionLogisticsService } from '../../../../services/construction-logistics.service';
import { ConstructionLogisticsComponent } from '../construction-logistics.component';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent implements OnInit {
  tittle = 'Nuevo Contratista';
  contractorControl = new FormControl();
  obj: IContractor = {
    name: '',
    dni: '',
    nit: '',
    phone: '',
    email: '',
    team: [],
    area: ''
  };
  team: string = '';
  constructor(
    private api: ConstructionLogisticsService,
    public dialogRef: MatDialogRef<ConstructionLogisticsComponent>
  ) {
    console.log('contractor Component');
  }

  ngOnInit(): void {}

  async onSave() {
    if (this.obj.nit == '') {
      this.obj.nit = this.obj.dni;
    }
    this.obj.team = this.team.split(',');
    let projectObject = {
      ...this.obj
      // articles: articleSelected,
      // detail: saleUnitSelected
    };
    const contractor = await this.api.createContractor(projectObject);
    //console.log('constractor>>>>', contractor);
    this.dialogRef.close({ ok: true });
  }
}
