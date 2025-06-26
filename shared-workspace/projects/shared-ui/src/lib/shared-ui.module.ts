import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentViewingComponent } from './document-viewing/document-viewing.component';

@NgModule({
  declarations: [
    DocumentViewingComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    DocumentViewingComponent,
    FormsModule
  ]
})
export class SharedUiModule { }