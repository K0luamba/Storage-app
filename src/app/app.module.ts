import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialDesignModule } from './material-design.module';

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
      MaterialDesignModule,

      AppRoutingModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
