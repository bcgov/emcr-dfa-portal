/* tslint:disable */
/* eslint-disable */
import { CaptchaConfiguration } from './captcha-configuration';
import { OidcOptions } from './oidc-options';
import { OutageInformation } from './outage-information';
import { S3Configuration } from './s-3-configuration';
import { TimeoutConfiguration } from './timeout-configuration';
export interface Configuration {
  captcha?: CaptchaConfiguration;
  oidc?: OidcOptions;
  outageInfo?: OutageInformation;
  s3?: S3Configuration;
  timeoutInfo?: TimeoutConfiguration;
}
