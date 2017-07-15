/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import {HttpModule} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

describe('ProfileService', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ProfileService]
    });
  });

  it('should ...', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));
});
