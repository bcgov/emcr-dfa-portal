export const environment = {
  production: true,
  version: '1.0.0',
  tokenRefreshPeriodInSeconds: 5 * 60,
  httpRetryNumber: 3,
  httpRetryDelayInSeconds: 5,
  // 2024-08-14 EMCRI-216 waynezen; upgrade to Angular 18
  apiBaseUrl: '.'
};
