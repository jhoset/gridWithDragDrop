import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone, OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {GridComponent, RowArgs} from "@progress/kendo-angular-grid";
import {take} from "rxjs/operators";

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
  selector: 'app-grid-with-drag-drop',
  templateUrl: './grid-with-drag-drop.component.html',
  styleUrls: ['./grid-with-drag-drop.component.css']
})
export class GridWithDragDropComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public dataSource: any[]
  @Input() public selectable: boolean = true
  @Input() public columns: gridColumn[] = []
  @Input() public nameIdItem = 'ProductID'
  @Input() public noDataMessage = 'No records available yet.'
  @Input() public secondGridRef: GridComponent

  private setOfIndex: any[] = []
  public dropIndex;
  public targetCells: NodeListOf<HTMLTableDataCellElement>;

  @ViewChild('firstGridRef', { static: true }) currentGridRef: GridComponent
  //CONSTRUCTOR
  constructor(private renderer: Renderer2, public zone: NgZone) {
  }

  public isRowSelected = (e: RowArgs) => this.setOfIndex.indexOf(e.dataItem[this.nameIdItem]) >= 0;

  onCellClick({dataItem}) {
    // Get de Id in the array of selected items
    const idx = this.setOfIndex.findIndex(e => e == dataItem[this.nameIdItem]);
    if (idx > -1) {
      // item is selected, remove it
      this.setOfIndex.splice(idx, 1);
    } else {
      this.setOfIndex.push(dataItem[this.nameIdItem]);
    }
    console.log('onCellClick() | SetOfIndex', this.setOfIndex)
  }
  public ngAfterViewInit() {
    console.log('ngAfterViewInit()')
    this.setDraggableRows();
  }

  public ngOnDestroy() {
    console.log('onDestroy()')
    this.destroyListeners();
  }

  public destroyListeners(): void {
    const tableRows: Array<HTMLElement> = this.getAllRows();
    tableRows.forEach((item) => {
      item.removeEventListener('dragstart', () => {});
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

      let selectedItem: any = this.dataSource.find((i) => i[this.nameIdItem] === Number(rowItem.textContent));
      let dataItem = JSON.stringify(selectedItem);
      e.dataTransfer.setData('text/plain', dataItem);
    });
  }

  // Prevents dragging header and 'no records' row.
  public onDragStart(e: DragEvent, grid: GridComponent): void {
    console.log('onDragStart()')
    // this.currentGridRef = grid;
    const draggedElement: string = (e.target as HTMLElement).innerText;
    if (draggedElement.includes('ID') || draggedElement === this.noDataMessage) {
      console.log(draggedElement)
      e.preventDefault();
    }
  }

  public onDrop(e: DragEvent, dragStartGridRef: GridComponent, droppedRowGridRef: GridComponent): void {
    console.log('onDrop()')
    console.log('DragEvebt', e.dataTransfer.getData('text/plain'))
    let data = e.dataTransfer.getData('text/plain');
    let droppedItem: any = JSON.parse(data);
    // Prevent dropping row in the same Grid
    const ItemsAvailableToDrop: any[] = ( droppedRowGridRef.data as any[] )
    const selectedItems: any[] = []
    console.log('itemsFirstGridRef', ItemsAvailableToDrop)
    console.log('itemsSecondGridReef', ( dragStartGridRef.data as any[] ))
    console.log("SetOfIndex", this.setOfIndex)
    ItemsAvailableToDrop.forEach( target => {
      if (this.setOfIndex.includes(target.ProductID)) {
        console.log('123')
        selectedItems.push(target)
      }
    })
    console.log('Seleccionados', selectedItems)
    if ( selectedItems.length ) {
      selectedItems.forEach( itemDropped => {
        if (dragStartGridRef !== this.currentGridRef) {
          this.updateGridsData(itemDropped, droppedRowGridRef, dragStartGridRef);
          // this.setOfIndex = []
        }
      })
    } else {
      if (dragStartGridRef !== this.currentGridRef) {
        this.updateGridsData(droppedItem, droppedRowGridRef, dragStartGridRef);
        // this.setOfIndex = []
      }
    }
    // When new row is added to a table, the draggable attributes is set to that row.
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.destroyListeners();
      this.setDraggableRows();
    });
    this.removeLineIndicators();
    this.setOfIndex = []
  }

  public onDragOver(e: DragEvent, grid: GridComponent): void {
    console.log('onDragOver()')
    e.preventDefault();
    if (this.targetCells) {
      this.removeLineIndicators();
    }
    // console.log('Elemento...', e)
    // console.log('Grid', grid)
    const targetEl = e.target as HTMLElement;
    // console.log("TargetElement", targetEl)
    if (this.currentGridRef !== grid && (targetEl.tagName === 'TD' || targetEl.tagName === 'TH')) {
      // Set drop line indication
      this.targetCells = targetEl.parentElement.querySelectorAll('td, th');
      // console.log("TargetCells", this.targetCells)
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
  }

  public removeLineIndicators() {
    this.targetCells.forEach((td: HTMLElement) => {
      this.renderer.removeAttribute(td, 'class');
    });
  }

  public updateGridsData(droppedItem: any, droppedRowGridRef: GridComponent, dragStartGridRef: GridComponent): void {
    const droppedRowGridData = droppedRowGridRef.data as Array<any>;
    const dragStartGridData = dragStartGridRef.data as Array<any>;

    let index: number = droppedRowGridData.findIndex((i) => i[this.nameIdItem] === droppedItem[this.nameIdItem]);
    droppedRowGridData.splice(index, 1);
    dragStartGridData.splice(this.dropIndex, 0, droppedItem);
  }

  ngOnInit(): void {
  }

}
