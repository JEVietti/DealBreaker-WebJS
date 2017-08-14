/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ValidateService } from './validate.service';

describe('ValidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateService]
    });
  });

  it('should ...', inject([ValidateService], (service: ValidateService) => {
    expect(service).toBeTruthy();
  }));


  it('Date Validation', inject([ValidateService], (service: ValidateService) => {
    expect(service.validateDate("")).toBeFalsy()
    expect(service.validateDate(" ")).toBeFalsy()
    expect(service.validateDate("2017-02-31")).toBeFalsy()
    expect(service.validateDate("2017-02-30")).toBeFalsy()
    expect(service.validateDate("2017-02-29")).toBeFalsy()
    expect(service.validateDate("2017-04-31")).toBeFalsy()
    expect(service.validateDate("2017-06-31")).toBeFalsy()
    expect(service.validateDate("2017-09-31")).toBeFalsy()
    expect(service.validateDate("2017-11-31")).toBeFalsy()
    expect(service.validateDate("2017-13-00")).toBeFalsy()
    expect(service.validateDate("2017-00-01")).toBeFalsy()
    expect(service.validateDate("2017-13-12")).toBeFalsy()
    expect(service.validateDate("2017-00-00")).toBeFalsy()

    expect(service.validateDate("2017-01-01")).toBeTruthy()
    expect(service.validateDate("2017-02-28")).toBeTruthy()
    expect(service.validateDate("2017-12-31")).toBeTruthy()  
  }))


   it('Date Validation', inject([ValidateService], (service: ValidateService) => {
    expect(service.validateDOB("")).toBeFalsy()
    expect(service.validateDOB(" ")).toBeFalsy()
    expect(service.validateDOB("2000-07-15")).toBeFalsy()
    expect(service.validateDOB("2000-00-00")).toBeFalsy()

    expect(service.validateDOB("1999-01-01")).toBeTruthy()
    expect(service.validateDOB("1999-07-14")).toBeTruthy()    
 
  }))

  it('Email Validation', inject([ValidateService], (service: ValidateService) => {
    expect(service.validateEmail("")).toBeFalsy()
    expect(service.validateEmail(" ")).toBeFalsy()
    expect(service.validateEmail("a")).toBeFalsy()
    expect(service.validateEmail("a@")).toBeFalsy()
    expect(service.validateEmail("a@g")).toBeFalsy()
    expect(service.validateEmail("a.com")).toBeFalsy()
    expect(service.validateEmail("a@.com")).toBeFalsy()
    expect(service.validateEmail("@gmail.com")).toBeFalsy()

    expect(service.validateEmail("a@gmail.com")).toBeTruthy()    
    expect(service.validateEmail("a1@gmail.com")).toBeTruthy()    
    expect(service.validateEmail("1@gmail.com")).toBeTruthy()    

  }))

  it('Password Validation', inject([ValidateService], (service: ValidateService) => {
    expect(service.validatePassword("a", "ab")).toBeFalsy()
      
    expect(service.validatePassword("a", "a")).toBeTruthy()    

  }))

  it('Name Validation', inject([ValidateService], (service: ValidateService) => {
    expect(service.validateName("")).toBeFalsy()
    expect(service.validateName(" ")).toBeFalsy()
    expect(service.validateName("123")).toBeFalsy()    
    
      
    expect(service.validateName("Name")).toBeTruthy()
    expect(service.validateName("Name Name")).toBeTruthy()
    expect(service.validateName("'Name")).toBeTruthy()

  }))
  




});
