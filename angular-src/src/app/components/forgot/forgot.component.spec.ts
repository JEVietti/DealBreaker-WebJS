/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgotComponent } from './forgot.component';

import {RouterTestingModule} from '@angular/router/testing'
import {FormsModule} from '@angular/forms'
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {HttpModule} from '@angular/http'

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpModule],
      providers: [ValidateService, AuthService],
      declarations: [ ForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
