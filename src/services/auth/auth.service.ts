import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, of } from 'rxjs';
import { Therapist } from '../../app/interfaces';
import { TherapistService } from '../therapist/therapist';
import { BookingService } from '../booking/booking';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(private router: Router, private therapist_service: TherapistService) {
    this.isAuthenticated = !!localStorage.getItem(this.tokenKey);
  }

  login(targetEmail: string, targetPassword: string): Observable<boolean> {
    return from(this.therapist_service.getTherapist(targetEmail, targetPassword)).pipe(
      map(user => {
        if (user != null) {
          this.isAuthenticated = true;
          localStorage.setItem(this.tokenKey, 'mock_jwt_token_' + Date.now());
          localStorage.setItem(this.userKey, JSON.stringify(user));
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  isLoggedInAsUser(): boolean {
    const user = this.getCurrentUser();
    return (this.isAuthenticated || !!localStorage.getItem(this.tokenKey)) && 
           user !== null
  }

  getCurrentUser(): Therapist | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}