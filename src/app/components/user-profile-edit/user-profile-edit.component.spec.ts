import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileEditComponent } from './user-profile-edit.component';
import { UserProfileService } from '../../services/user-profile.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserProfileEditComponent', () => {
  let component: UserProfileEditComponent;
  let fixture: ComponentFixture<UserProfileEditComponent>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userProfileService = jasmine.createSpyObj('UserProfileService', ['getUserProfile', 'updateUserProfile']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        UserProfileEditComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserProfileService, useValue: userProfileService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    userProfileService.getUserProfile.and.returnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      profilePicture: null
    }));

    fixture = TestBed.createComponent(UserProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(1);
    expect(component.profileForm.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      profilePicture: null
    });
  });

  it('should handle profile loading error', () => {
    userProfileService.getUserProfile.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'Profile not found',
      status: 404
    })));

    component.loadUserProfile();

    expect(component.errorMessage()).toBe('Profile not found');
    expect(component.isLoading()).toBeFalse();
  });

  it('should submit form successfully', () => {
    const updatedProfile = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      profilePicture: null
    };

    userProfileService.updateUserProfile.and.returnValue(of(updatedProfile));

    component.profileForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '987-654-3210'
    });

    component.onSubmit();

    expect(userProfileService.updateUserProfile).toHaveBeenCalledWith(1, {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '987-654-3210'
    });
    expect(component.successMessage()).toBe('Profile updated successfully');
  });

  it('should handle form submission error', () => {
    userProfileService.updateUserProfile.and.returnValue(throwError(() => new HttpErrorResponse({
      error: 'Update failed',
      status: 500
    })));

    component.onSubmit();

    expect(component.errorMessage()).toBe('Update failed');
    expect(component.isSubmitting()).toBeFalse();
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
