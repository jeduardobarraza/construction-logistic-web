import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleUnitComponent } from './sale-unit.component';

describe('SaleUnitComponent', () => {
  let component: SaleUnitComponent;
  let fixture: ComponentFixture<SaleUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
