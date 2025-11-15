import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmployeesService } from '../../../../services/employee.service';
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.scss'
})
export class CreateEmployee implements OnInit {
  employeeForm: FormGroup;
  roles: Role[] = [];
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeesService: EmployeesService,
    private rolesService: RolesService
  ) {
    this.employeeForm = this.fb.group({
      cc: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id_role: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (err) => console.error('Error cargando roles', err)
    });
  }

  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.employeesService.create(this.employeeForm.value).subscribe({
      next: (response) => {
        alert(`Empleado ${response.data.name} creado exitosamente`);
        this.router.navigate(['/admin/employees']);
      },
      error: (err) => {
        console.error('Error creando empleado', err);
        alert('Error al crear empleado: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/employees']);
  }
}