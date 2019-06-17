import { TestBed, inject } from '@angular/core/testing';

import { SocialService } from './social.service';

describe('Ng6SocialButtonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialService]
    });
  });

  it('should be created', inject([SocialService], (service: SocialService) => {
    expect(service).toBeTruthy();
  }));
});
