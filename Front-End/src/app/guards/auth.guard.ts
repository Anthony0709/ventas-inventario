import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      if (!payloadDecoded.exp) return true;
      const expiry = payloadDecoded.exp * 1000;
      return Date.now() > expiry;
    } catch {
      return true;
    }
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (token && !this.isTokenExpired(token)) {
      const expectedRoles = route.data['role'];
      const userRole = this.authService.getUserRole();

      if (!expectedRoles) return true;

      if (Array.isArray(expectedRoles)) {
        if (expectedRoles.includes(userRole)) return true;
      } else {
        if (userRole === expectedRoles) return true;
      }

      this.router.navigate(['/unauthorized']);
      return false;
    }

    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}