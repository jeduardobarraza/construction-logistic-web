import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from 'ngx-loading';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { GetProjectComponent } from './components/projects/get-project/get-project.component';
import { AngularMaterialModule } from './modules/angular-material.module';
import { OrdersComponent } from './components/orders/orders.component';
import { ApiHelperService } from './services/api-helper.service';
import { GetLibraryComponent } from './components/projects/get-library/get-library.component';
import { ConstructionLogisticsComponent } from './components/projects/construction-logistics/construction-logistics.component';
import { GetManufacturingOrderComponent } from './components/projects/construction-logistics/get-manufacturing-order/get-manufacturing-order.component';
import { GetRouteComponent } from './components/projects/construction-logistics/get-route/get-route.component';
import { GetInvoicingComponent } from './components/projects/construction-logistics/get-route/get-invoicing/get-invoicing.component';
import { GetInvoicePdfComponent } from './components/projects/construction-logistics/get-route/get-invoicing/get-invoice-pdf/get-invoice-pdf.component';
import { SalesUnitLocationComponent } from './components/projects/construction-logistics/sales-unit-location/sales-unit-location.component';
import { GetInvoiceHistoryComponent } from './components/projects/construction-logistics/get-invoice-history/get-invoice-history.component';
import { GetSetComponent } from './components/projects/get-library/get-set/get-set.component';
import { SaleUnitComponent } from './components/projects/get-project/sale-unit/sale-unit.component';
import { GetConfirmComponent } from './components/projects/get-library/get-confirm/get-confirm.component';
import { GetShowItComponent } from './components/projects/get-library/get-show-it/get-show-it.component';
import { GetPieceComponent } from './components/projects/get-library/get-piece/get-piece.component';
import { GetComponentComponent } from './components/projects/get-library/get-component/get-component.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    GetProjectComponent,
    OrdersComponent,
    GetLibraryComponent,
    GetSetComponent,
    SaleUnitComponent,
    GetConfirmComponent,
    GetShowItComponent,
    GetPieceComponent,
    GetComponentComponent,
    ConstructionLogisticsComponent,
    GetManufacturingOrderComponent,
    GetRouteComponent,
    GetInvoicingComponent,
    GetInvoicePdfComponent,
    SalesUnitLocationComponent,
    GetInvoiceHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // ngx-translate and the loader module
    HttpClientModule,
    ToastrModule.forRoot(),
    AgGridModule,
    BrowserAnimationsModule,
    NgSelectModule,
    AngularMaterialModule,
    MatChipsModule,
    NgxLoadingModule.forRoot({}),
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [ApiHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
