import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorageComponent } from './storage/storage.component';

const routes: Routes = [
  { path: '', component: StorageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
