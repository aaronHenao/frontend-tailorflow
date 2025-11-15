import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cc: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void{
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const homeRoute = this.authService.getHomeRoute();
          this.router.navigate([homeRoute]);
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert('Credenciales inválidas');
        }
      })
    }
  }
}
