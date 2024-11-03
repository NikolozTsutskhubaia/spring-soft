import { Routes } from '@angular/router';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserProfileEditComponent} from './components/user-profile-edit/user-profile-edit.component';


export const routes: Routes = [
  { path: '', component: UserProfileComponent },
  { path: 'edit-profile', component: UserProfileEditComponent }
];
