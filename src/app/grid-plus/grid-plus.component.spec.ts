import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPlusComponent } from './grid-plus.component';

describe('GridPlusComponent', () => {
  let component: GridPlusComponent;
  let fixture: ComponentFixture<GridPlusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridPlusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
