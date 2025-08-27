import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
role: string = '';
  username: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const payload = this.auth.getUserPayload();

    if (payload) {
      // Si el token ya trae role explícito, úsalo.
      if (payload.role) {
        this.role = payload.role;
      }
      // Compatibilidad con tokens antiguos que solo tienen is_admin
      else if (payload.is_admin !== undefined) {
        this.role = payload.is_admin ? 'admin' : 'seller';
      }

      // `sub` en el token lo estamos usando como username
      if (payload.sub) {
        this.username = payload.sub;
      }
    }
    console.log('Rol detectado en Sidebar:', this.role);
    console.log('Usuario detectado en Sidebar:', this.username);
  }
debugClick(destino: string) {
  console.log('Click detectado hacia:', destino);
}

}

