// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ApiConfiguration } from '../app/core/api/api-configuration'

const apiconfig: ApiConfiguration = new ApiConfiguration;

export const environment = {
  production: false,
  version: '1.0.0',
  tokenRefreshPeriodInSeconds: 1 * 60,
  httpRetryNumber: 3,
  httpRetryDelayInSeconds: 5,
  // 2024-08-14 EMCRI-216 waynezen; upgrade to Angular 18
  apiBaseUrl: apiconfig.rootUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
