// src/app/guards/auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate: CanActivateFn = () => {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Not logged in, redirect to login page
    this.router.navigate(['/login']);
    return false;
  };
}