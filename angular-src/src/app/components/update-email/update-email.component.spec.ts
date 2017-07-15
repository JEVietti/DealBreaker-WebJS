/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UpdateEmailComponent } from './update-email.component';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { ValidateService } from '../../services/validate.service'
import {HttpModule, Http} from '@angular/http'
// import {  } from '@angular/http/testing'
import {Router, ActivatedRoute, Params} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateEmailComponent', () => {
  let component: UpdateEmailComponent;
  let fixture: ComponentFixture<UpdateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, FormsModule],
      providers: [AuthService, ValidateService],
      declarations: [ UpdateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
