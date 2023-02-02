import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstructionLogisticsComponent } from '../construction-logistics.component';

@Component({
  selector: 'app-get-contract',
  templateUrl: './get-contract.component.html',
  styleUrls: ['./get-contract.component.scss']
})
export class GetContractComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConstructionLogisticsComponent>) {}

  ngOnInit(): void {}
}
