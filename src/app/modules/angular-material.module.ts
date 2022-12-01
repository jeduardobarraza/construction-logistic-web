import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

const materialModules = [
  FormsModule,
  ReactiveFormsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule,
  MatTabsModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatCheckboxModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules]
})
export class AngularMaterialModule {}
