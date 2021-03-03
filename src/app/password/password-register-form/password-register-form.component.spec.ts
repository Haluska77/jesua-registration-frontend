import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordRegisterFormComponent} from './password-register-form.component';

describe('PasswordRegisterFormComponent', () => {
  let component: PasswordRegisterFormComponent;
  let fixture: ComponentFixture<PasswordRegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordRegisterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
