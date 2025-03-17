/* tslint:disable */
/* eslint-disable */
import { ProjectStageOptionSet } from './project-stage-option-set';
export interface RecoveryPlan {
  approvedAmendedProjectCost?: null | number;
  approvedCost?: null | number;
  approvedTotal?: null | number;
  causeofDamageDetails?: null | string;
  claimTotal?: null | number;
  createdDate?: null | string;
  describeDamageDetails?: null | string;
  describeDamagedInfrastructure?: null | string;
  differentDamageDatesReason?: null | string;
  emcrapprovalcomments?: null | string;
  estimateCostIncludingTax?: null | number;
  estimatedCompletionDate?: null | string;
  infraDamageDetails?: null | string;
  isdamagedDateSameAsApplication?: null | boolean;
  paidProjectAmount?: null | number;
  project18MonthDeadline?: null | string;
  projectApprovedDate?: null | string;
  projectDecision?: null | string;
  projectName?: null | string;
  projectNumber?: null | string;
  projectStatus?: null | ProjectStageOptionSet;
  projectType?: null | string;
  projectTypeOther?: null | string;
  repairDamagedInfrastructure?: null | string;
  repairWorkDetails?: null | string;
  siteLocation?: null | string;
  sitelocationdamageFromDate?: null | string;
  sitelocationdamageToDate?: null | string;
  submittedDate?: null | string;
}
