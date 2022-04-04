import {AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, Renderer2, TemplateRef} from '@angular/core';
import {GridComponent, RowArgs} from "@progress/kendo-angular-grid";
import {take} from "rxjs/operators";


// Utils
export const tableRow = (node) => {
  if (node.tagName) {
    return node.tagName.toLowerCase() === 'tr';
  }
};
export const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};

export interface gridColumn {
  field: string,
  title: string,
  width: number
}

@Component({
  selector: 'app-grid-plus',
  templateUrl: './grid-plus.component.html',
  styleUrls: ['./grid-plus.component.css']
})
export class GridPlusComponent implements OnInit, AfterViewInit, OnDestroy {
  // Inputs
  @Input() objectIdName
  @Input() firstGridData: any[] = []
  @Input() firstGridColumns: gridColumn[]
  @Input() firstGridHeight: number
  @Input() firstGridFooterTemplate: TemplateRef<HTMLElement>
  @Input() secondGridData: any[] = []
  @Input() secondGridColumns: gridColumn[]
  @Input() secondGridHeight: number
  @Input() secondGridFooterTemplate: TemplateRef<HTMLElement>
  // Attributes
  public setOfId: any[] = []
  public dropIndex: number = 0
  public noRecordsMsg = 'No records available yet'
  public currentGridRef: GridComponent
  public targetCells: NodeListOf<HTMLTableDataCellElement>

  constructor(private renderer: Renderer2, public zone: NgZone) {
  }

  ngOnInit(): void {
  }

  // Use an arrow function to capture the 'this' execution context of the class.
  public isRowSelected = (e: RowArgs) => this.setOfId.indexOf(e.dataItem[this.objectIdName]) >= 0;

  public onCellClick({dataItem}) {
    // Get de Id in the array of selected items
    const idx = this.setOfId.findIndex(e => e == dataItem[this.objectIdName]);
    if (idx > -1) {
      // item is selected, remove it
      this.setOfId.splice(idx, 1);
    } else {
      this.setOfId.push(dataItem[this.objectIdName]);
    }
    console.log('Total ( setOfId ) :', this.setOfId)
  }

  public ngAfterViewInit() {
    this.setDraggableRows();
  }

  public ngOnDestroy() {
    this.destroyListeners();
  }

  public destroyListeners(): void {
    const tableRows: Array<HTMLElement> = this.getAllRows();
    tableRows.forEach((item) => {
      item.removeEventListener('dragstart', () => {
      });
    });
  }

  public setDraggableRows(): void {
    const tableRows: Array<HTMLTableElement> = this.getAllRows();
    tableRows.forEach((item: HTMLElement) => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      this.addDragListeners(item);
    });
  }

  public getAllRows(): Array<HTMLTableElement> {
    return Array.from(document.querySelectorAll('.k-grid tr'));
  }

  public addDragListeners(item: HTMLElement): void {
    item.addEventListener('dragstart', (e: DragEvent) => {
      const rowItem: HTMLTableDataCellElement = item.querySelector('td');

      // Prevents dragging Grid header row
      if (rowItem === null) {
        return;
      }
      let totalData = this.firstGridData.concat(this.secondGridData)
      let selectedItem: any = totalData.find((i) => i[this.objectIdName] === Number(rowItem.textContent));
      let dataItem = JSON.stringify(selectedItem);
      e.dataTransfer.setData('text/plain', dataItem);
    });
  }

  // Prevents dragging header and 'no records' row.
  public onDragStart(e: DragEvent, grid: GridComponent): void {
    try {
      this.currentGridRef = grid;
      const draggedElement: string = (e.target as HTMLElement).innerText;
      if (draggedElement.includes(this.objectIdName) || draggedElement === this.noRecordsMsg) {
        e.preventDefault();
      }
    } catch (e) {
      console.log('Error in onDragStart() ->', e)
    }
  }

  public onDrop(e: DragEvent, dragStartGridRef: GridComponent, droppedRowGridRef: GridComponent): void {
    try {
      // e.preventDefault()
      console.log('Set of Id', this.setOfId)
      if (this.setOfId && this.setOfId.length) {
        // Transfer more than one row
        let droppedItems: any[] = (droppedRowGridRef.data as any[]).filter(item => this.setOfId.includes(item[this.objectIdName]))
        if (droppedItems && droppedItems.length) {
          droppedItems.forEach(droppedItem => {
            if (dragStartGridRef !== this.currentGridRef) {
              this.updateGridsData(droppedItem, droppedRowGridRef, dragStartGridRef);
              this.setOfId = []
            }
          })
        }
      } else {
        // Transfer only one row
        console.log(e.dataTransfer)
        let data = e.dataTransfer.getData('text/plain');
        let droppedItem: any = JSON.parse(data);
        if (dragStartGridRef !== this.currentGridRef) {
          this.updateGridsData(droppedItem, droppedRowGridRef, dragStartGridRef);
          this.setOfId = []
        }
      }
      // When new row is added to a table, the draggable attributes is set to that row.
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.destroyListeners();
        this.setDraggableRows();
      });
      this.removeLineIndicators();
    } catch (e) {
      console.log('Error in onDrop() ->', e)
    }
  }

  public onDragOver(e: DragEvent, grid: GridComponent): void {
    try {
      e.preventDefault();
      if (this.targetCells) {
        this.removeLineIndicators();
      }
      const targetEl = e.target as HTMLElement;
      if (this.currentGridRef !== grid && (targetEl.tagName === 'TD' || targetEl.tagName === 'TH')) {
        // Set drop line indication
        this.targetCells = targetEl.parentElement.querySelectorAll('td, th');
        this.targetCells.forEach((td: HTMLElement) => {
          const gridData: any[] = grid.data as any[];
          if (td.tagName === 'TH' && gridData.length !== 0) {
            this.renderer.addClass(td, 'th-line');
            this.dropIndex = 0;

          } else if (td.tagName === 'TD') {
            this.renderer.addClass(td, 'td-line');
            this.dropIndex = closest(e.target, tableRow).rowIndex + 1;
          }
        });
      }
    } catch (e) {
      console.log('Error in onDragOver() ->', e)
    }
  }

  public removeLineIndicators() {
    this.targetCells.forEach((td: HTMLElement) => {
      this.renderer.removeAttribute(td, 'class');
    });
  }

  public updateGridsData(droppedItem: any, droppedRowGridRef: GridComponent, dragStartGridRef: GridComponent): void {
    const droppedRowGridData = droppedRowGridRef.data as Array<any>;
    const dragStartGridData = dragStartGridRef.data as Array<any>;

    let index: number = droppedRowGridData.findIndex((i) => i[this.objectIdName] === droppedItem[this.objectIdName]);
    // Remove
    droppedRowGridData.splice(index, 1);
    // Add in dropIndex position
    dragStartGridData.splice(this.dropIndex, 0, droppedItem);
  }

  public onMoveSecondGrid() {
    try {
      if (this.setOfId) {
        let i = 0
        this.firstGridData = this.firstGridData.filter(item => {
          if (this.setOfId.includes(item.ProductID)) {
            this.secondGridData.splice(i, 0, item)
            i++
          } else {
            return item
          }
        })
        this.setOfId = []
        // When new row is added to a table, the draggable attributes is set to that row.
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.destroyListeners();
          this.setDraggableRows();
        });
        this.removeLineIndicators();
      }
    } catch (e) {
      console.log('Error in onMoveSecondGrid() ->', e)
    }
  }

  public onMoveFirstGrid() {
    try {
      if (this.setOfId) {
        let i = 0
        this.secondGridData = this.secondGridData.filter(item => {
          if (this.setOfId.includes(item.ProductID)) {
            this.firstGridData.splice(i, 0, item)
            i++
          } else {
            return item
          }
        })
        this.setOfId = []
        // When new row is added to a table, the draggable attributes is set to that row.
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.destroyListeners();
          this.setDraggableRows();
        });
        this.removeLineIndicators();
      }
    } catch (e) {
      console.log('Error in onMoveFirstGrid() ->', e)
    }
  }

}
