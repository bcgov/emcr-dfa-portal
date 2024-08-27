/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ApplicationService } from './services/application.service';
import { AttachmentService } from './services/attachment.service';
import { ClaimService } from './services/claim.service';
import { CleanUpLogItemService } from './services/clean-up-log-item.service';
import { ConfigurationService } from './services/configuration.service';
import { ContactService } from './services/contact.service';
import { DamagedRoomService } from './services/damaged-room.service';
import { EligibilityService } from './services/eligibility.service';
import { FullTimeOccupantService } from './services/full-time-occupant.service';
import { InvoiceService } from './services/invoice.service';
import { OtherContactService } from './services/other-contact.service';
import { ProfileService } from './services/profile.service';
import { ProjectService } from './services/project.service';
import { SecondaryApplicantService } from './services/secondary-applicant.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ApplicationService,
    AttachmentService,
    ClaimService,
    CleanUpLogItemService,
    ConfigurationService,
    ContactService,
    DamagedRoomService,
    EligibilityService,
    FullTimeOccupantService,
    InvoiceService,
    OtherContactService,
    ProfileService,
    ProjectService,
    SecondaryApplicantService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
