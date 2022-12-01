import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetShowItComponent } from './get-show-it.component';

describe('GetShowItComponent', () => {
  let component: GetShowItComponent;
  let fixture: ComponentFixture<GetShowItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetShowItComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetShowItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
