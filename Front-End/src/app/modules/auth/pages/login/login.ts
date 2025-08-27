import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
credentials = {
    username: '',
    password: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

   login(): void {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res);
        if (res.access_token) {
          this.authService.saveToken(res.access_token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Token no recibido';
        }
      },
      error: (err) => {
        this.errorMessage = err.error.detail || 'Credenciales inválidas';
      }
    });
  }
}
