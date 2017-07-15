/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImageManageComponent } from './image-manage.component';

import {RouterTestingModule} from '@angular/router/testing'
import {ImagesService} from '../../services/images.service'
import {AuthService} from '../../services/auth.service'
import {HttpModule} from '@angular/http'

describe('ImageManageComponent', () => {
  let component: ImageManageComponent;
  let fixture: ComponentFixture<ImageManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule],
      providers: [ ImagesService, AuthService ],
      declarations: [ ImageManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
