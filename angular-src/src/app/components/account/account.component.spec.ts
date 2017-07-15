/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccountComponent } from './account.component';
import {UpdatePasswordComponent} from '../update-password/update-password.component'
import {UpdateEmailComponent} from '../update-email/update-email.component'
import {FormsModule} from '@angular/forms'
import {AuthService} from '../../services/auth.service'
import {ValidateService} from '../../services/validate.service'
import {HttpModule} from '@angular/http'
import {RouterTestingModule} from '@angular/router/testing'

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, RouterTestingModule],
      providers: [AuthService, ValidateService],
      declarations: [ 
        AccountComponent,
        UpdatePasswordComponent,
        UpdateEmailComponent
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
