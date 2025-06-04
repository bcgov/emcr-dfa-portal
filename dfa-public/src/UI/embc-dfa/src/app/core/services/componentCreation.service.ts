import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentMetaDataModel } from '../model/componentMetaData.model';

@Injectable({ providedIn: 'root' })
export class ComponentCreationService {
  dynamicComponents: any = [
    { type: 'personal-details' },
    { type: 'address' },
    { type: 'contact-info' },
    { type: 'review' }
  ];
  profileComponents: Array<any> = [
    {
      component: 'personal-details',
      nextButtonLabel: 'Next - Address',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -2,
      stepName: 'Personal Details'
    },
    {
      component: 'address',
      nextButtonLabel: 'Next - Contact Information',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Address'
    },
    {
      component: 'contact-info',
      nextButtonLabel: 'Next - Review & Submit',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Contact'
    }
    //,
    //{
    //  component: 'security-questions',
    //  nextButtonLabel: 'Next - Create Evacuation File',
    //  backButtonLabel: 'Go Back & Edit',
    //  isLast: true,
    //  loadWrapperButton: false,
    //  lastStep: 0,
    //  stepName: 'Security Questions'
    //}
  ];

  dfaApplicationStartComponents: Array<any> = [
    {
      component: 'consent',
      nextButtonLabel: 'Next - Verify Your Profile',
      backButtonLabel: 'Cancel',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -2,
      stepName: 'Consent'
    },
    {
      component: 'profile-verification',
      nextButtonLabel: 'Next - Application Type',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Verify Your Profile'
    },
    {
      component: 'apptype-insurance',
      nextButtonLabel: 'Next - Damaged Property',
      backButtonLabel: 'Go Back',
      isLast: true,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Application Type & Insurance'
    }
  ];

  dfaApplicationMainComponents: Array<any> = [
    {
      component: 'application-details',
      nextButtonLabel: 'Next - Contact Information',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -1,
      stepName: 'Application Details'
    },
    {
      component: 'contacts',
      nextButtonLabel: 'Next - Review & Submit',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Contact Information'
    }
  ];

  dfaProjectMainComponents: Array<any> = [

    {
      component: 'recovery-plan',
      nextButtonLabel: 'Next - Upload Documents',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -1,
      stepName: 'Recovery Plan',
      editable: true
    },
    {
      component: 'supporting-documents-project',
      nextButtonLabel: 'Next - Review & Submit',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Upload Documents',
      editable: false
    }

  ];

  dfaClaimMainComponents: Array<any> = [

    {
      component: 'recovery-claim',
      nextButtonLabel: 'Next - Add Invoices',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -1,
      stepName: 'Claim Submission',
      editable: true
    },
    {
      component: 'dfa-invoice-dashboard',
      nextButtonLabel: 'Next - Upload Documents',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Add Invoices',
      editable: true
    },
    {
      component: 'supporting-documents-claim',
      nextButtonLabel: 'Next - Review & Submit',
      backButtonLabel: 'Go Back',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Upload Documents',
      editable: false
    }

  ];

  dfaAmendmentMainComponents: Array<any> = [
    {
      component: 'amendment',
      nextButtonLabel: 'Next - Upload Documents',
      backButtonLabel: 'Go Back',
      isLast: true,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Amendment Submission',
      editable: true
    }
  ];

    getProfileComponents(): Observable<any> {
    const profile = new Observable((observer) => {
      observer.next(this.dynamicComponents);
      observer.complete();
    });
    return profile;
  }

  createProfileSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.profileComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  createDFAApplicationStartSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaApplicationStartComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  createDFAApplicationMainSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaApplicationMainComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  //2024-10-11 EMCRI-820 waynezen;
  modifyDFAApplicationMainStepsforSubmitted(steps: Array<ComponentMetaDataModel>, vieworedit: string): void {
    if (vieworedit == 'view') {
      if (steps[0]) {
        steps[0].nextButtonLabel = "Next - Update Contact Information";
      }

      if (steps[1]) {
        steps[1].nextButtonLabel = "Next - Review & Save";
        steps[1].backButtonLabel = "Go Back";
      }
    }
  }


  createDFAProjectMainSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaProjectMainComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  createDFAClaimMainSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaClaimMainComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

    createDFAAmendmentMainSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaAmendmentMainComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }
}
