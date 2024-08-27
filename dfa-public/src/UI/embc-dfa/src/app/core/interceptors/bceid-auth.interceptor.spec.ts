import { TestBed } from '@angular/core/testing';

import { BceidAuthInterceptor } from './bceid-auth.interceptor';

describe('BceidAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BceidAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BceidAuthInterceptor = TestBed.inject(BceidAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
