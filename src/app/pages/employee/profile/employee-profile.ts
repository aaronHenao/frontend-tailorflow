// employee-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeesService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.scss'
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private employeesService: EmployeesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeProfile();
  }

  loadEmployeeProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser?.cc) {
      this.errorMessage = 'No se pudo obtener la información del usuario';
      this.isLoading = false;
      return;
    }

    this.employeesService.getEmployeeDetails(currentUser.cc).subscribe({
      next: (response) => {
        this.employee = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.errorMessage = 'Error al cargar la información del perfil';
        this.isLoading = false;
      }
    });
  }

  getStatusColor(state: string): 'primary' | 'warn' | 'accent' {
    const normalizedState = state.toLowerCase();
    
    if (normalizedState.includes('active') || normalizedState.includes('activo')) {
      return 'primary';
    }
    if (normalizedState.includes('inactive') || normalizedState.includes('inactivo')) {
      return 'warn';
    }
    return 'accent';
  }
}