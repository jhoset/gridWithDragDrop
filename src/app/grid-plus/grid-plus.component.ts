import {
  AfterViewInit,
  Component, EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef, ViewChild
} from '@angular/core';
import {GridComponent, RowArgs} from "@progress/kendo-angular-grid";
import {take} from "rxjs/operators";
import { v4 as uuidv4 } from 'uuid';
import {Observable} from "rxjs";

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
  // Outputs
  @Output() droppedItemFirstGrid: EventEmitter<any> = new EventEmitter<any>()
  @Output() droppedItemSecondGrid: EventEmitter<any> = new EventEmitter<any>()
  // Inputs
  @Input() onFilter$: Observable<boolean> = new Observable<boolean>()
  @Input() multiSelect: boolean = true
  @Input() objectIdName
  @Input() skipButtons: boolean = false
  @Input() firstGridData: any[]
  @Input() firstGridColumns: gridColumn[]
  @Input() firstGridHeight: number
  @Input() firstGridHide: boolean
  @Input() firstGridHeaderTemplate: TemplateRef<HTMLElement>
  @Input() firstGridFooterTemplate: TemplateRef<HTMLElement>
  @Input() secondGridData: any[]
  @Input() secondGridColumns: gridColumn[]
  @Input() secondGridHeight: number
  @Input() secondGridHide: boolean
  @Input() secondGridHeaderTemplate: TemplateRef<HTMLElement>
  @Input() secondGridFooterTemplate: TemplateRef<HTMLElement>
  // Attributes
  public setOfId: any[] = []
  public dropIndex: number = 0
  public noRecordsMsg = 'No records available yet'
  public currentGridRef: GridComponent
  public targetCells: NodeListOf<HTMLTableDataCellElement>
  // ViewChild
  @ViewChild('firstGrid') firstGrid: GridComponent
  @ViewChild('secondGrid') secondGrid: GridComponent

  constructor(private renderer: Renderer2, public zone: NgZone) {
  }

  ngOnInit(): void {
    this.onFilter$.subscribe( value => {
      if ( value ) {
        console.log('Configuring')
        this.zone.onStable.pipe(take(1)).subscribe(() => {
          this.destroyListeners();
          this.setDraggableRows();
        });
      }
    })
  }
  // Use an arrow function to capture the 'this' execution context of the class.
  public isRowSelected = (e: RowArgs) => this.setOfId.indexOf(e.dataItem[this.objectIdName]) >= 0;

  public onCellClick({dataItem}) {
    if ( this.multiSelect ) {
      // Get de Id in the array of selected items
      const idx = this.setOfId.findIndex(e => e == dataItem[this.objectIdName]);
      if (idx > -1) {
        // item is selected, remove it
        this.setOfId.splice(idx, 1);
      } else {
        this.setOfId.push(dataItem[this.objectIdName]);
      }
      console.log('Total ( setOfId ) :', this.setOfId)
    } else {
      const idx = this.setOfId.findIndex(e => e == dataItem[this.objectIdName]);
      if (idx > -1) {
        // item is selected, remove it
        this.setOfId.splice(idx, 1);
      } else {
        if ( this.setOfId.length > 0 ) {
          this.setOfId = []
        }
        this.setOfId.push(dataItem[this.objectIdName]);
      }
    }
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
  public getUIDAndName( id: number) {
       return id + uuidv4()
  }
  public addDragListeners(item: HTMLElement): void {
    item.addEventListener('dragstart', (e: DragEvent) => {
      // const rowItem: HTMLTableDataCellElement = item.querySelector('td');
      // console.log('rowId', (item.getElementsByTagName('span')[0].id))
      if ( !item.getElementsByTagName('span')[0]?.id ) {
        return;
      }
      let rowIdItem = (item.getElementsByTagName('span')[0].id)
      // console.log('rowIdObject', (item.getElementsByTagName('span')[0].id) )
      // Prevents dragging Grid header row
      if ( !rowIdItem ) {
        return;
      }
      // if (rowItem === null) {
      //   return;
      // }
      let totalData = this.firstGridData.concat(this.secondGridData)
      let selectedItem: any = totalData.find((item) => item[this.objectIdName] == rowIdItem);
      // console.log('Selected Item', JSON.stringify(selectedItem))
      if (selectedItem) {
        let dataItem = JSON.stringify(selectedItem);
        e.dataTransfer.setData('text/plain', dataItem);
      }
    });
  }

  // Prevents dragging header and 'no records' row.
  public onDragStart(e: DragEvent, grid: GridComponent): void {
    try {
      this.currentGridRef = grid;
      const draggedElement: string = (e.target as HTMLElement).innerText;
      if (this.isHeader(draggedElement) || draggedElement === this.noRecordsMsg) {
        console.log('Se previene drag')
        e.preventDefault();
      } else {
        const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'))
        if ( this.setOfId.length < 2 ) {
          if ( this.currentGridRef === this.firstGrid ){
            console.log('Emitira primero')
            this.droppedItemFirstGrid.emit( droppedItem )
          } else {
            console.log('Emitira segundo')
            this.droppedItemSecondGrid.emit( droppedItem )
          }
        }
      }
    } catch (e) {
      console.log('Error in onDragStart() ->', e)
    }
  }

  public isHeader(row: string): boolean {
    let firstMatch = true
    let secondMatch = true
    this.firstGridColumns.forEach(column => {
      firstMatch = firstMatch && row.includes(column.title)
    })
    this.secondGridColumns.forEach(column => {
      secondMatch = secondMatch && row.includes(column.title)
    })
    console.log('isHeader', firstMatch || secondMatch)
    return (firstMatch || secondMatch)
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
            }
          })
          this.setOfId = []
        }
      } else {
        // Transfer only one row
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
      if (dragStartGridRef !== this.currentGridRef) {
        this.removeLineIndicators();
      }

    } catch (e) {
      console.error('Error in onDrop() ->', e)
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

  public onMove(droppedRowGridRef: GridComponent, dragStartGridRef: GridComponent) {
    try {
      if (this.setOfId && this.setOfId.length) {
        // Transfer more than one row
        let droppedItems: any[] = (droppedRowGridRef.data as any[]).filter(item => this.setOfId.includes(item[this.objectIdName]))
        if (droppedItems && droppedItems.length) {
          this.currentGridRef = droppedRowGridRef
          droppedItems.forEach(droppedItem => {
            if (dragStartGridRef !== this.currentGridRef) {
              this.updateGridsData(droppedItem, droppedRowGridRef, dragStartGridRef);
              this.dropIndex++
            }
          })
          this.dropIndex = 0
          this.setOfId = []
        }
      }
      // When new row is added to a table, the draggable attributes is set to that row.
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.destroyListeners();
        this.setDraggableRows();
      });
      // this.removeLineIndicators();
    } catch (e) {
      console.error('Error in onMove() ->', e)
    }
  }
}
