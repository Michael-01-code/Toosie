import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AddRefillService } from './add-refill.service';

describe('AddRefillService', () => {
  let service: AddRefillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(AddRefillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
