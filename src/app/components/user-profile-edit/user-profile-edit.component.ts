import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule ],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  profileForm: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  currentProfile = signal<UserProfile | null>(null);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);
  isLoading = signal(false);
  private snackBar = inject(MatSnackBar);
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];


  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9-+()\\s]*$')]],
      profilePicture: [null]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  private showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  loadUserProfile() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userProfileService.getUserProfile(1).subscribe({
      next: (profile) => {
        this.currentProfile.set(profile);
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone || '',
          profilePicture: null
        });
        if (profile.profilePicture) {
          this.previewUrl.set(profile.profilePicture);
        }
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.size > this.MAX_FILE_SIZE) {
        this.errorMessage.set('File size exceeds 5MB limit');
        return;
      }

      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.errorMessage.set('Only JPEG, PNG and GIF files are allowed');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();

      reader.onerror = () => {
        this.errorMessage.set('Error reading file');
        this.selectedFile = null;
        this.previewUrl.set(null);
      };

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          const base64String = e.target.result;
          this.previewUrl.set(base64String);
          this.errorMessage.set('');
        }
      };

      reader.readAsDataURL(file);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['email']) return 'Invalid email format';
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['pattern']) {
      if (fieldName === 'phone') return 'Invalid phone number format';
      if (fieldName === 'email') return 'Invalid email format';
    }

    return 'Invalid field';
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error:', error);
    let message = 'An error occurred';

    if (error.error instanceof Error) {
      message = error.error.message;
    } else if (typeof error.error === 'string') {
      message = error.error;
    } else if (error.status === 500) {
      message = 'Server error occurred';
    }

    this.errorMessage.set(message);
  }

  private prepareUpdateData(): Partial<UserProfile> {
    const formValue = this.profileForm.value;

    const updateData: Partial<UserProfile> = {
      firstName: formValue.firstName?.trim(),
      lastName: formValue.lastName?.trim(),
      email: formValue.email?.trim(),
      phone: formValue.phone?.trim() || null
    };

    if (this.previewUrl()) {
      updateData.profilePicture = this.previewUrl();
    }

    return updateData;
  }

  onSubmit() {
    if (this.profileForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.successMessage.set('');
      this.errorMessage.set('');

      try {
        const updateData = this.prepareUpdateData();

        this.userProfileService.updateUserProfile(1, updateData).subscribe({
          next: (response) => {
            this.currentProfile.set(response);
            const successMsg = 'Profile updated successfully';
            this.successMessage.set(successMsg);
            this.showMessage(successMsg);
            setTimeout(() => {
              this.isSubmitting.set(false);
              this.router.navigate(['/']);
            }, 2000);
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            this.isSubmitting.set(false);
          }
        });
      } catch (error) {
        const errorMsg = 'Error preparing form data';
        this.errorMessage.set(errorMsg);
        this.showMessage(errorMsg, true);
        this.isSubmitting.set(false);
      }
    } else {
      const errorMsg = 'Please fix the form errors before submitting';
      this.errorMessage.set(errorMsg);
      this.showMessage(errorMsg, true);
    }
  }

  onCancel(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.router.navigate(['/']);
  }
}
