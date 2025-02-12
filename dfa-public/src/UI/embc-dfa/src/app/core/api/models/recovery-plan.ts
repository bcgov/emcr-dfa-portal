/* tslint:disable */
/* eslint-disable */
import { ProjectStageOptionSet } from './project-stage-option-set';
export interface RecoveryPlan {
  causeofDamageDetails?: null | string;
  describeDamageDetails?: null | string;
  describeDamagedInfrastructure?: null | string;
  differentDamageDatesReason?: null | string;
  estimateCostIncludingTax?: null | number;
  estimatedCompletionDate?: null | string;
  infraDamageDetails?: null | string;
  isdamagedDateSameAsApplication?: null | boolean;
  projectName?: null | string;
  projectNumber?: null | string;
  projectStatus?: null | ProjectStageOptionSet;
  repairDamagedInfrastructure?: null | string;
  repairWorkDetails?: null | string;
  siteLocation?: null | string;
  sitelocationdamageFromDate?: null | string;
  sitelocationdamageToDate?: null | string;
}
