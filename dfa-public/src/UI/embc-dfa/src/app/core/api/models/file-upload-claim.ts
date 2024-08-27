/* tslint:disable */
/* eslint-disable */
import { FileCategoryClaim } from './file-category-claim';
import { RequiredDocumentTypeClaim } from './required-document-type-claim';
export interface FileUploadClaim {
  claimId?: null | string;
  contentType?: null | string;
  deleteFlag?: boolean;
  fileData?: null | string;
  fileDescription?: null | string;
  fileName?: null | string;
  fileSize?: null | number;
  fileType?: null | FileCategoryClaim;
  fileTypeText?: null | string;
  id?: null | string;
  modifiedBy?: null | string;
  requiredDocumentType?: null | RequiredDocumentTypeClaim;
  uploadedDate?: null | string;
}
