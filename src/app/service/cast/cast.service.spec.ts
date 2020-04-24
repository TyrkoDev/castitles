/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CastService } from './cast.service';

describe('NgCastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CastService]
    });
  });

  it('should ...', inject([CastService], (service: CastService) => {
    expect(service).toBeTruthy();
  }));
});
