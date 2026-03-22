import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar si el usuario está autenticado como usuario normal
  if (authService.isLoggedInAsUser()) {
    return true;
  }
  
  // Si no está autenticado, redirige al login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};