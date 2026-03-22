import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ¡Importante añadir esto!
 // Para ngIf y otras directivas

@Component({
  selector: 'app-login',
  standalone: true, // Importante para componentes standalone
  imports: [FormsModule], // Añadir FormsModule para two-way binding
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Validaciones básicas
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          console.log('Login exitoso');
          
          // Obtenemos el usuario para saber a dónde mandarlo
          const currentUser = this.authService.getCurrentUser();

          if (currentUser) {
            this.router.navigate(['/home/today']); 
          } else {
            this.errorMessage = 'Error al obtener información del usuario';
            this.isLoading = false;
          }
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Error en el servidor. Intente nuevamente.';
        this.isLoading = false;
        console.error('Login error:', error);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}