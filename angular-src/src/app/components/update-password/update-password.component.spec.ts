/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './update-password.component';
import { AuthService } from '../../services/auth.service'
import {HttpModule, Http} from '@angular/http'
// import {  } from '@angular/http/testing'
import {Router, ActivatedRoute, Params} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule, FormsModule],
      providers: [AuthService],
      declarations: [ UpdatePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
