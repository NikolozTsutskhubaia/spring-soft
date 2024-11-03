import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserProfile(id: number) {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  updateUserProfile(id: number, data: Partial<UserProfile>) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put<UserProfile>(
      `${this.apiUrl}/${id}`,
      JSON.stringify(data),
      { headers }
    );
  }
}
