/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrowseService } from './browse.service';
import { HttpModule } from '@angular/http'


describe('BrowseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [BrowseService]
    });
  });

  it('should ...', inject([BrowseService], (service: BrowseService) => {
    expect(service).toBeTruthy();
  }));
});
