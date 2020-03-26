import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProductComponent } from './import-product.component';

describe('ImportProductComponent', () => {
  let component: ImportProductComponent;
  let fixture: ComponentFixture<ImportProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
