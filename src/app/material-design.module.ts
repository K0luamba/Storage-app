import { NgModule } from '@angular/core';
import {
  MatIconModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatDialogModule,
  MatButtonModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  exports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class MaterialDesignModule {}
