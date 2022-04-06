import {Component, Renderer2} from '@angular/core';
import {sampleProducts} from "./button-control-panel/products";
import {Product} from "./button-control-panel/models";
import {take} from "rxjs/operators";
import {GridComponent} from "@progress/kendo-angular-grid";
import {Form, FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public formGroupTest = new FormGroup({
    category: new FormControl('')
  })
  get category(): FormControl{
    return this.formGroupTest.get('category') as FormControl
  }
  public onFilter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public defaultItemRegistrationForm: { key: string; value: string } = {key: "select value ...", value: null}
  public registrationForm: { key: string; value: string; }[] =
    [{value: "1", key: 'Category One'}, {value: "2", key: "Category Two"}];
  public firstData = [
    {
      "ProductID" : 1,
      "ProductName" : "Chai",
      "SupplierID" : 1,
      "CategoryID" : 1,
      "QuantityPerUnit" : "10 boxes x 20 bags",
      "UnitPrice" : 18.0000,
      "UnitsInStock" : 39,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 10,
      "Discontinued" : false,
    }, {
      "ProductID" : 2,
      "ProductName" : "Chang",
      "SupplierID" : 1,
      "CategoryID" : 2,
      "QuantityPerUnit" : "24 - 12 oz bottles",
      "UnitPrice" : 19.0000,
      "UnitsInStock" : 17,
      "UnitsOnOrder" : 40,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public secondData= [
    {
      "ProductID" : 4,
      "ProductName" : "Chef Anton's Cajun Seasoning",
      "SupplierID" : 2,
      "CategoryID" : 2,
      "QuantityPerUnit" : "48 - 6 oz jars",
      "UnitPrice" : 22.0000,
      "UnitsInStock" : 53,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : false,
    }, {
      "ProductID" : 5,
      "ProductName" : "Chef Anton's Gumbo Mix",
      "SupplierID" : 2,
      "CategoryID" : 1,
      "QuantityPerUnit" : "36 boxes",
      "UnitPrice" : 21.3500,
      "UnitsInStock" : 0,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : true,
    }, {
      "ProductID" : 6,
      "ProductName" : "Grandma's Boysenberry Spread",
      "SupplierID" : 3,
      "CategoryID" : 2,
      "QuantityPerUnit" : "12 - 8 oz jars",
      "UnitPrice" : 25.0000,
      "UnitsInStock" : 120,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public firstData2 = [
    {
      "ProductID" : 1,
      "ProductName" : "Chai",
      "SupplierID" : 1,
      "CategoryID" : 1,
      "QuantityPerUnit" : "10 boxes x 20 bags",
      "UnitPrice" : 18.0000,
      "UnitsInStock" : 39,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 10,
      "Discontinued" : false,
    }, {
      "ProductID" : 2,
      "ProductName" : "Chang",
      "SupplierID" : 1,
      "CategoryID" : 2,
      "QuantityPerUnit" : "24 - 12 oz bottles",
      "UnitPrice" : 19.0000,
      "UnitsInStock" : 17,
      "UnitsOnOrder" : 40,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public secondData2= [
    {
      "ProductID" : 4,
      "ProductName" : "Chef Anton's Cajun Seasoning",
      "SupplierID" : 2,
      "CategoryID" : 2,
      "QuantityPerUnit" : "48 - 6 oz jars",
      "UnitPrice" : 22.0000,
      "UnitsInStock" : 53,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : false,
    }, {
      "ProductID" : 5,
      "ProductName" : "Chef Anton's Gumbo Mix",
      "SupplierID" : 2,
      "CategoryID" : 1,
      "QuantityPerUnit" : "36 boxes",
      "UnitPrice" : 21.3500,
      "UnitsInStock" : 0,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : true,
    }, {
      "ProductID" : 6,
      "ProductName" : "Grandma's Boysenberry Spread",
      "SupplierID" : 3,
      "CategoryID" : 2,
      "QuantityPerUnit" : "12 - 8 oz jars",
      "UnitPrice" : 25.0000,
      "UnitsInStock" : 120,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public firstData3 = [
    {
      "ProductID" : 1,
      "ProductName" : "Chai",
      "SupplierID" : 1,
      "CategoryID" : 1,
      "QuantityPerUnit" : "10 boxes x 20 bags",
      "UnitPrice" : 18.0000,
      "UnitsInStock" : 39,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 10,
      "Discontinued" : false,
    }, {
      "ProductID" : 2,
      "ProductName" : "Chang",
      "SupplierID" : 1,
      "CategoryID" : 2,
      "QuantityPerUnit" : "24 - 12 oz bottles",
      "UnitPrice" : 19.0000,
      "UnitsInStock" : 17,
      "UnitsOnOrder" : 40,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public secondData3= [
    {
      "ProductID" : 4,
      "ProductName" : "Chef Anton's Cajun Seasoning",
      "SupplierID" : 2,
      "CategoryID" : 2,
      "QuantityPerUnit" : "48 - 6 oz jars",
      "UnitPrice" : 22.0000,
      "UnitsInStock" : 53,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : false,
    }, {
      "ProductID" : 5,
      "ProductName" : "Chef Anton's Gumbo Mix",
      "SupplierID" : 2,
      "CategoryID" : 1,
      "QuantityPerUnit" : "36 boxes",
      "UnitPrice" : 21.3500,
      "UnitsInStock" : 0,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : true,
    }, {
      "ProductID" : 6,
      "ProductName" : "Grandma's Boysenberry Spread",
      "SupplierID" : 3,
      "CategoryID" : 2,
      "QuantityPerUnit" : "12 - 8 oz jars",
      "UnitPrice" : 25.0000,
      "UnitsInStock" : 120,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public firstData4 = [
    {
      "ProductID" : 1,
      "ProductName" : "Chai",
      "SupplierID" : 1,
      "CategoryID" : 1,
      "QuantityPerUnit" : "10 boxes x 20 bags",
      "UnitPrice" : 18.0000,
      "UnitsInStock" : 39,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 10,
      "Discontinued" : false,
    }, {
      "ProductID" : 2,
      "ProductName" : "Chang",
      "SupplierID" : 1,
      "CategoryID" : 2,
      "QuantityPerUnit" : "24 - 12 oz bottles",
      "UnitPrice" : 19.0000,
      "UnitsInStock" : 17,
      "UnitsOnOrder" : 40,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public secondData4= [
    {
      "ProductID" : 4,
      "ProductName" : "Chef Anton's Cajun Seasoning",
      "SupplierID" : 2,
      "CategoryID" : 2,
      "QuantityPerUnit" : "48 - 6 oz jars",
      "UnitPrice" : 22.0000,
      "UnitsInStock" : 53,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : false,
    }, {
      "ProductID" : 5,
      "ProductName" : "Chef Anton's Gumbo Mix",
      "SupplierID" : 2,
      "CategoryID" : 1,
      "QuantityPerUnit" : "36 boxes",
      "UnitPrice" : 21.3500,
      "UnitsInStock" : 0,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 0,
      "Discontinued" : true,
    }, {
      "ProductID" : 6,
      "ProductName" : "Grandma's Boysenberry Spread",
      "SupplierID" : 3,
      "CategoryID" : 2,
      "QuantityPerUnit" : "12 - 8 oz jars",
      "UnitPrice" : 25.0000,
      "UnitsInStock" : 120,
      "UnitsOnOrder" : 0,
      "ReorderLevel" : 25,
      "Discontinued" : false,
    }
  ];
  public firstGridColumns = [
    {field: 'ProductName', title: 'Name', width: 20}]
  public SecondGridColumns = [
    {field: 'ProductName', title: 'Name', width: 20}]
  public firstGridDataByCategory = []
  title = 'kendo-angular-app';

  public constructor() {

  }

  ngOnInit() {
  }

  onTest1(obj) {

    console.log('Test1 ', obj.CategoryID )
    // this.category.setValue(String( obj.CategoryID ))
    // this.firstData = this.firstData.filter( c => String(c.CategoryID) === String( obj.CategoryID ) )
  }
  onTest2(obj) {
    console.log('Test2   ', obj.CategoryID )
    this.category.setValue(String( obj.CategoryID ))
    this.onChange()
  }
  onChange() {
    this.firstData4 = this.firstData.filter( p => String(p.CategoryID) === this.category.value )
    this.onFilter$.next(true)
  }

}
