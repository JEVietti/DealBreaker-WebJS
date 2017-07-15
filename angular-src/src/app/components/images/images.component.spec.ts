/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImagesComponent } from './images.component';
import { ImageManageComponent } from '../image-manage/image-manage.component';
import {FormsModule} from '@angular/forms'
import {AuthService} from '../../services/auth.service'
import {ImagesService} from '../../services/images.service'
import {HttpModule} from '@angular/http'
import {RouterTestingModule} from '@angular/router/testing'

describe('ImagesComponent', () => {
  let component: ImagesComponent;
  let fixture: ComponentFixture<ImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule],
      providers: [AuthService, ImagesService],
      declarations: [ ImagesComponent, ImageManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
