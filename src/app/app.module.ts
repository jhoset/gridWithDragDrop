import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ButtonControlPanelComponent } from './button-control-panel/button-control-panel.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {CheckBoxModule} from "@progress/kendo-angular-inputs";
import {StepperModule} from "@progress/kendo-angular-layout";
import { GridPlusComponent } from './grid-plus/grid-plus.component';
import {LabelModule} from "@progress/kendo-angular-label";






@NgModule({
  declarations: [
    AppComponent,
    ButtonControlPanelComponent,
    GridPlusComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DropDownsModule,
        BrowserAnimationsModule,
        GridModule,
        TreeViewModule,
        ButtonsModule,
        CheckBoxModule,
        StepperModule,
        LabelModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
