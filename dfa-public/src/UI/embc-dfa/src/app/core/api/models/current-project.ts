/* tslint:disable */
/* eslint-disable */
import { ProjectStatusBar } from './project-status-bar';
export interface CurrentProject {
  applicationId?: string;
  createdDate?: string;
  dateFileClosed?: string;
  deadline18Month?: string;
  emcrApprovedAmount?: string;
  estimatedCompletionDate?: string;
  hasAmendment?: boolean;
  isClaimSubmission?: boolean;
  isErrorInStatus?: boolean;
  isHidden?: boolean;
  projectDecision?: string;
  projectId?: string;
  projectName?: string;
  projectNumber?: string;
  projectType?: string;
  projectTypeOther?: string;
  siteLocation?: string;
  stage?: string;
  status?: string;
  statusBar?: Array<ProjectStatusBar>;
  statusColor?: string;
  statusLastUpdated?: string;
  useAmendments?: boolean;
}
