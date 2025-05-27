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
      nextButtonLabel: 'Next - Damaged Property',
      backButtonLabel: 'Return to Dashboard',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -2,
      stepName: 'Application Details'
    },   
    {
      component: 'damaged-property-address',
      nextButtonLabel: 'Next - Cause of Damage',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Damaged Property'
    },
    {
      component: 'property-damage',
      nextButtonLabel: 'Next - Occupants',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Cause of Damage'
    },
    {
      component: 'occupants',
      nextButtonLabel: 'Next - Clean Up Log',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Occupants'
    },
    {
      component: 'clean-up-log',
      nextButtonLabel: 'Next - Damaged Items By Room',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Clean Up Log'
    },
    {
      component: 'damaged-items-by-room',
      nextButtonLabel: 'Next - Supporting Documents',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Damaged Items By Room'
    },
    {
      component: 'supporting-documents',
      nextButtonLabel: 'Next - Review',
      backButtonLabel: 'Go Back & Edit',
      isLast: false,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Supporting Documents'
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

  dfaAppealComponents: Array<any> = [
    {
      component: 'appeal-reason',
      nextButtonLabel: 'Next – Sign & Submit',
      backButtonLabel: 'Cancel Appeal',
      isLast: false,
      loadWrapperButton: false,
      lastStep: -2,
      stepName: 'Appeal Reason'
    },
    {
      component: 'sign-and-submit',
      nextButtonLabel: 'Submit Appeal',
      backButtonLabel: 'Go Back & Edit',
      isLast: true,
      loadWrapperButton: false,
      lastStep: 0,
      stepName: 'Sign & Submit'
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

  createDFAProjectMainSteps(): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaProjectMainComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }

  createDFAAppealSteps(appealType: string): Array<ComponentMetaDataModel> {
    const componentArr: Array<ComponentMetaDataModel> =
      new Array<ComponentMetaDataModel>();
    for (const comp of this.dfaAppealComponents) {
      componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
    }
    return componentArr;
  }
}
