/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RelationshipService } from './relationship.service';

describe('RelationshipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelationshipService]
    });
  });

  it('should ...', inject([RelationshipService], (service: RelationshipService) => {
    expect(service).toBeTruthy();
  }));
});
