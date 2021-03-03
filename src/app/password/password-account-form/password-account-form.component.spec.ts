import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordAccountFormComponent} from './password-account-form.component';

describe('PasswordAccountFormComponent', () => {
  let component: PasswordAccountFormComponent;
  let fixture: ComponentFixture<PasswordAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordAccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
