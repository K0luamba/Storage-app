import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from './material-design.module';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageComponent } from './storage/storage.component';

@NgModule({
   declarations: [
      AppComponent,
      StorageComponent
   ],
   imports: [
      CommonModule,
      BrowserModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MaterialDesignModule,
      MatSortModule,

      AppRoutingModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
