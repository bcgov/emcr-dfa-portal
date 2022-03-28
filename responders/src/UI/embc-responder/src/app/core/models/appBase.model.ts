import { EssTaskModel } from './ess-task.model';

export interface AppBaseModel {
  selectedEssTask?: EssTaskModel;
  selectedUserPathway?: SelectedPathType;
}

export enum SelectedPathType {
  paperBased = 'paperBased',
  digital = 'digital',
  remoteExtensions = 'remoteExtensions'
}

export enum ETransferStatus {
  available = 'available',
  notAllowed = 'notAllowed',
  inEligible = 'ineligible',
  unavailable = 'unavailable'
}

export enum EtransferContent {
  bcServicesCard = 'Profile linked to BC Services Card',
  isNotMinor = 'Evacuee is over 19 years of age',
  acceptTransfer = 'Ability to accept e-Transfer',
  window = '4-hr window to receive money'
}

export class EtransferRequirementStatus {
  statement?: EtransferContent;
  status?: boolean;
}
