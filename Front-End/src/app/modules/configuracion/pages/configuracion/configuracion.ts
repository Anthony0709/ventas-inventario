import { Component } from '@angular/core';
import { UsersService } from '../../../../services/users.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  standalone: false,
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class Configuracion {
form!: FormGroup;
  usuarios: any[] = [];
  selected: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['seller', Validators.required] // Dropdown admin/seller
    });

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  guardarUsuario(): void {
    const payload = {
      username: this.form.value.username,
      email: this.form.value.email,password: this.form.value.password,
      is_admin: this.form.value.rol === 'admin' // convierte string a boolean
    };

    if (this.selected) {
      // Actualizar
      this.userService.update(this.selected.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.cargarUsuarios();
        },
        error: (err) => console.error('Error actualizando usuario', err)
      });
    } else {
      // Crear nuevo
      this.userService.create(payload).subscribe({
        next: () => {
          this.resetForm();
          this.cargarUsuarios();
        },
        error: (err) => console.error('Error creando usuario', err)
      });
    }
  }

  editarUsuario(usuario: any): void {
    this.selected = usuario;
    this.form.patchValue({
      username: usuario.username,
      email: usuario.email,
      password: '',
      rol: usuario.is_admin ? 'admin' : 'seller'
    });
}

  eliminarUsuario(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error eliminando usuario', err)
    });
  }

  resetForm(): void {
    this.selected = null;
    this.form.reset({ rol: 'seller' });
  }
}
