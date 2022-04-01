import {Component, AfterViewInit, Renderer2, NgZone, OnDestroy, ViewEncapsulation, OnInit} from '@angular/core';
import {GridComponent, GridDataResult, PageChangeEvent, RowArgs} from '@progress/kendo-angular-grid';
import { take } from 'rxjs/operators';
import { Product } from './models';
import {products, sampleProducts} from './products';
import { tableRow, closest } from './utils';

@Component({
  selector: 'app-button-control-panel',
  templateUrl: './button-control-panel.component.html',
  styleUrls: ['./button-control-panel.component.css']
})
export class ButtonControlPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  // Ref GRID 2
  public refGrid2: GridComponent = null
  public refGrid1: GridComponent = null







  // Use an arrow function to capture the 'this' execution context of the class.
  public isRowSelected = (e: RowArgs) =>
    this.setOfIndex.indexOf(e.dataItem.ProductID) >= 0;
  // GRID PRINCIPAL ATRIBUTOS
  public setOfIndex: any[] = []
  public expandedKeys: number[] = [2];
  // public isRowSelected = (e: RowArgs) => this.setOfIndex.indexOf(e.dataItem.index) >= 0;
  public employees: any[] = [
    { employeeId: 2, name: 'Andrew Fuller', reportsTo: null },
    { employeeId: 1, name: 'Nancy Davolio', reportsTo: 2 },
    { employeeId: 3, name: 'Janet Leverling', reportsTo: 2 },
    { employeeId: 4, name: 'Margaret Peacock', reportsTo: 2 },
    { employeeId: 5, name: 'Steven Buchanan', reportsTo: 2 },
    { employeeId: 8, name: 'Laura Callahan', reportsTo: 2 },
    { employeeId: 6, name: 'Michael Suyama', reportsTo: 5 },
    { employeeId: 7, name: 'Robert King', reportsTo: 5 },
    { employeeId: 9, name: 'Anne Dodsworth', reportsTo: 5 }
  ];
  public firstGridData = sampleProducts.slice(0, 3);
  public secondGridData = sampleProducts.slice(3, 6);
  public dropIndex;
  public noRecordsMsg = 'No records available yet.';
  public currentGridRef: GridComponent;
  public targetCells: NodeListOf<HTMLTableDataCellElement>;

  constructor(private renderer: Renderer2, public zone: NgZone) {
  }

  // second


  test( e ) {
    console.log('Referencia', e)
    this.refGrid2 = e
  }
  test1( e ) {
    console.log('Referencia Grid1', e)
    this.refGrid1 = e
  }

  onCellClick({dataItem}) {
    console.log('Item seleccionado ', dataItem)
    // Get de Id in the array of selected items
    const idx = this.setOfIndex.findIndex(e => e == dataItem.ProductID);
    if (idx > -1) {
      // item is selected, remove it
      this.setOfIndex.splice(idx, 1);
    } else {
      this.setOfIndex.push(dataItem.ProductID);
    }
    console.log('Total', this.setOfIndex)
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

      let selectedItem: Product = sampleProducts.find((i) => i.ProductID === Number(rowItem.textContent));
      let dataItem = JSON.stringify(selectedItem);
      e.dataTransfer.setData('text/plain', dataItem);
    });
  }

  // Prevents dragging header and 'no records' row.
  public onDragStart(e: DragEvent, grid: GridComponent): void {
    this.currentGridRef = grid;
    console.log('Element Dragged',  (e.target as HTMLElement).innerText)
    const draggedElement: string = (e.target as HTMLElement).innerText;
    if (draggedElement.includes('ID') || draggedElement === this.noRecordsMsg) {
      console.log(draggedElement)
      e.preventDefault();
    }
  }

  public onDrop(e: DragEvent, dragStartGridRef: GridComponent, droppedRowGridRef: GridComponent): void {
    let data = e.dataTransfer.getData('text/plain');
    // console.log('Objeto recibido', e.dataTransfer.getData('text/plain'))
    // console.log('CONSOLEEEEE',  (dragStartGridRef))
    // console.log('Second Grid', droppedRowGridRef)
    let droppedItem: Product = JSON.parse(data);
    // Prevent dropping row in the same Grid
    const droppedItems: Product[] = ( droppedRowGridRef.data as Product[] )
    const selectedItems: Product[] = []

    console.log("index", this.setOfIndex)
    droppedItems.forEach( target => {
         if (this.setOfIndex.includes(target.ProductID)) {
           selectedItems.push(target)
         }
    })
    console.log('Seleccionados', selectedItems)
    if ( selectedItems.length ) {
      selectedItems.forEach( itemDropped => {
        if (dragStartGridRef !== this.currentGridRef) {
          this.updateGridsData(itemDropped, droppedRowGridRef, dragStartGridRef);
          this.setOfIndex = []
        }
      })
    } else {
      if (dragStartGridRef !== this.currentGridRef) {
        this.updateGridsData(droppedItem, droppedRowGridRef, dragStartGridRef);
        this.setOfIndex = []
      }
    }
    // When new row is added to a table, the draggable attributes is set to that row.
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.destroyListeners();
      this.setDraggableRows();
    });
    this.removeLineIndicators();
    console.log("Source Data of First Grid", this.firstGridData)
    console.log("Source Data of Second Grid", this.secondGridData)
  }

  public onDragOver(e: DragEvent, grid: GridComponent): void {
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

  public updateGridsData(droppedItem: Product, droppedRowGridRef: GridComponent, dragStartGridRef: GridComponent): void {
    const droppedRowGridData = droppedRowGridRef.data as Array<Product>;
    const dragStartGridData = dragStartGridRef.data as Array<Product>;

    let index: number = droppedRowGridData.findIndex((i) => i.ProductID === droppedItem.ProductID);
    droppedRowGridData.splice(index, 1);
    dragStartGridData.splice(this.dropIndex, 0, droppedItem);
  }

  ngOnInit(): void {
  }

}
