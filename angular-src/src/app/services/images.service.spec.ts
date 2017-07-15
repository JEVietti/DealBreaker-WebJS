/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImagesService } from './images.service';
import { HttpModule } from '@angular/http'
import { AuthService } from './auth.service'

describe('ImagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ImagesService, AuthService]
    });
  });

  it('should ...', inject([ImagesService], (service: ImagesService) => {
    expect(service).toBeTruthy();
  }));
});
