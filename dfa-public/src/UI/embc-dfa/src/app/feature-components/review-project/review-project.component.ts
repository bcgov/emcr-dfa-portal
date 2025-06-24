import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription, mapTo } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from '../../core/services/formCreation.service';
import {
  CaptchaResponse,
  CaptchaResponseType
} from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ApplicantOption, FarmOption, FileCategory, FileUpload, InsuranceOption, RoomType, SmallBusinessOption } from 'src/app/core/api/models';
import { MatTableDataSource } from '@angular/material/table';
import { DFAApplicationMainDataService } from '../dfa-application-main/dfa-application-main-data.service';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-review-project',
  standalone: false,
  templateUrl: './review-project.component.html',
  styleUrls: ['./review-project.component.scss']
})
export class ReviewProjectComponent implements OnInit {
  @Output() captchaPassed = new EventEmitter<CaptchaResponse>();
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;
  @Input() allowEdit: boolean;
  @Output() stepToNavigate = new EventEmitter<number>();
  componentToLoad: Observable<any>;
  cs: any;
  siteKey: string;
  supportingDocumentsDataSource = new MatTableDataSource<FileUpload>();
  supportingDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate'];
  requiredDocumentsDataSource = new MatTableDataSource<FileUpload>();
  requiredDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate'];
  hideCard = false;
  navigationExtras: NavigationExtras;
  

  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService
  ) {

    
  }

  ngOnInit(): void {
    this.navigationExtras = { state: { parentPageName: this.parentPageName } };
    if (this.currentFlow === 'verified-registration') {
      this.captchaPassed.emit({
        type: CaptchaResponseType.success
      });
    }

    //// subscribe to changes in full time occupants
    //const _fullTimeOccupantsFormArray = this.formCreationService.fullTimeOccupantsForm.value.get('fullTimeOccupants');
    //_fullTimeOccupantsFormArray.valueChanges
    //  .pipe(
    //    mapTo(_fullTimeOccupantsFormArray.getRawValue())
    //    ).subscribe(data => this.fullTimeOccupantsDataSource.data =  _fullTimeOccupantsFormArray.getRawValue());

    //// subscribe to changes in secondary applicants
    //const _secondaryApplicantsFormArray = this.formCreationService.secondaryApplicantsForm.value.get('secondaryApplicants');
    //_secondaryApplicantsFormArray.valueChanges
    //  .pipe(
    //    mapTo(_secondaryApplicantsFormArray.getRawValue())
    //    ).subscribe(data => this.secondaryApplicantsDataSource.data = _secondaryApplicantsFormArray.getRawValue());

    //// subscribe to changes in other contacts
    //const _otherContactsFormArray = this.formCreationService.otherContactsForm.value.get('otherContacts');
    //_otherContactsFormArray.valueChanges
    //  .pipe(
    //    mapTo(_otherContactsFormArray.getRawValue())
    //    ).subscribe(data => this.otherContactsDataSource.data = _otherContactsFormArray.getRawValue());

    //// subscribe to changes in clean up logs
    //const _cleanUpWorkFormArray = this.formCreationService.cleanUpLogItemsForm.value.get('cleanuplogs');
    //_cleanUpWorkFormArray.valueChanges
    //  .pipe(
    //    mapTo(_cleanUpWorkFormArray.getRawValue())
    //    ).subscribe(data => this.cleanUpWorkDataSource.data = _cleanUpWorkFormArray.getRawValue());

    //// subscribe to changes in damaged rooms
    //const _damagedRoomsFormArray = this.formCreationService.damagedRoomsForm.value.get('damagedRooms');
    //_damagedRoomsFormArray.valueChanges
    //  .pipe(
    //    mapTo(_damagedRoomsFormArray.getRawValue())
    //    ).subscribe(data => this.damagedRoomsDataSource.data = _damagedRoomsFormArray.getRawValue());

    // subscribe to changes in file uploads
    const _fileUploadsFormArray = this.formCreationService.fileUploadsForm.value.get('fileUploads');
    _fileUploadsFormArray.valueChanges
    .pipe(
      mapTo(_fileUploadsFormArray.value)
    ).subscribe(data => {
      this.supportingDocumentsDataSource.data =
        _fileUploadsFormArray.value?.filter(x =>
          (x.requiredDocumentType === null || x.requiredDocumentType === '' || x.requiredDocumentType === undefined)
          && x.deleteFlag === false);
      this.requiredDocumentsDataSource.data =
        _fileUploadsFormArray.value?.filter(x =>
          (x.requiredDocumentType !== null && x.requiredDocumentType !== '' && x.requiredDocumentType !== undefined)
          && x.deleteFlag === false);
    })
  }

  navigateToStep(stepIndex: number) {
    this.stepToNavigate.emit(stepIndex);
  }

  editDetails(componentToEdit: string): void {
    let route: string;
    //if (this.currentFlow === 'dfa-dashboard') {
    //  route = '/dfa-dashboard/edit/' + componentToEdit;
    //} else {
    //  route = '/verified-registration/edit/' + componentToEdit;
    //}
    this.router.navigate([route], this.navigationExtras);
  }

  back(): void {
    this.hideCard = false;
  }

  formatPostalCode(postalCode: string): string {
    let rtnPostalCode = postalCode;
    if (postalCode.length === 6) { return postalCode.substring(0,3) + " " + postalCode.substring(3,6)};
    return rtnPostalCode;
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaPassed.emit($event);
  }
}
