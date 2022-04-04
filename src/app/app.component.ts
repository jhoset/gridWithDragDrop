import {Component, Renderer2} from '@angular/core';
import {sampleProducts} from "./button-control-panel/products";
import {Product} from "./button-control-panel/models";
import {take} from "rxjs/operators";
import {GridComponent} from "@progress/kendo-angular-grid";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public firstGridData = sampleProducts.slice(0, 3);
  public secondGridData = sampleProducts.slice(3, 6);
  public firstGridColumns = [
    {field: 'ProductID', title: 'ID', width: 40},
    {field: 'ProductName', title: 'Name', width: 40}]
  public SecondGridColumns = [
    {field: 'ProductID', title: 'ID', width: 40},
    {field: 'ProductName', title: 'Name', width: 40}]

  title = 'kendo-angular-app';

  public constructor() {

  }

  ngOnInit() {
  }

  onTest() {
    console.log('Se dio click al template')
  }

}
