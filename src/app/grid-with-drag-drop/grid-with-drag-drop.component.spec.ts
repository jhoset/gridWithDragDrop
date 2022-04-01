import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWithDragDropComponent } from './grid-with-drag-drop.component';

describe('GridWithDragDropComponent', () => {
  let component: GridWithDragDropComponent;
  let fixture: ComponentFixture<GridWithDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridWithDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWithDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
