import { Component, inject, OnInit, signal } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { RouterLink} from '@angular/router';
import { UserProfile } from '../../models/user-profile.model';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private userProfileService = inject(UserProfileService);

  previewUrl = signal<string | null>(null);
  user = signal<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: null
  });

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userProfileService.getUserProfile(1).subscribe({
      next: (profile) => {
        if (profile) {
          const userProfile: UserProfile = {
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            email: profile.email ?? '',
            phone: profile.phone ?? '',
            profilePicture: profile.profilePicture ?? null
          };

          this.user.set(userProfile);
          this.previewUrl.set(userProfile.profilePicture);
        } else {
          console.warn('Fetched profile is undefined.');
          this.resetUserProfile();
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.resetUserProfile();
      }
    });
  }

  private resetUserProfile(): void {
    const emptyProfile: UserProfile = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profilePicture: null
    };

    this.user.set(emptyProfile);
    this.previewUrl.set(null);
  }

  getFirstName(): string {
    return this.user().firstName;
  }

  getLastName(): string {
    return this.user().lastName;
  }

  getEmail(): string {
    return this.user().email;
  }

  getPhone(): string {
    return this.user().phone;
  }

  getProfilePicture(): string | null {
    return this.previewUrl();
  }
}
