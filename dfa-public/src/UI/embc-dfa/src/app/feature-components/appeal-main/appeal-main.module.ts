import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppealDocumentsComponent } from 'src/app/feature-components/appeal-main/appeal-documents/appeal-documents.component';
import { AppealProjectDetailsComponent } from 'src/app/feature-components/appeal-main/appeal-project-details/appeal-project-details.component';
import { CoreModule } from '../../core/core.module';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../review/review.module';
import { AppealRoutingModule } from './appeal-main-routing.module';
import { AppealMainComponent } from './appeal-main.component';

@NgModule({
  declarations: [AppealMainComponent, AppealProjectDetailsComponent, AppealDocumentsComponent],
  imports: [
    AppealRoutingModule,
    CommonModule,
    ComponentWrapperModule,
    CoreModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ReviewModule
  ]
})
export class AppealMainModule {}
