import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmployeesService } from '../../../../services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.scss'
})
export class EditEmployee implements OnInit {
  employeeForm!: FormGroup; 
  employeeId!: number;
  employee!: Employee;
  isLoading = true;
  isSaving = false;

  estados = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {
    this.initForm(); 
  }

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params['id'];
    this.loadEmployee();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      password: ['', Validators.minLength(6)],
      state: ['', Validators.required]
    });
  }

  loadEmployee(): void {
    this.employeesService.getById(this.employeeId).subscribe({
      next: (response) => {
        this.employee = response.data;
      
        this.employeeForm.patchValue({
          state: this.employee.state
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando empleado', err);
        alert('Error al cargar empleado');
        this.router.navigate(['/admin/employees']);
      }
    });
  }

 
  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      alert('Por favor, revise los campos del formulario.'); 
      return;
    }

    this.isSaving = true;
  
    const { state, password } = this.employeeForm.getRawValue();

    const updateData: any = {
      state: state
    };

    if (password) {
      updateData.password = password;
    }

    this.employeesService.update(this.employeeId, updateData).subscribe({
      next: () => {
        alert('Empleado actualizado exitosamente');
        this.router.navigate(['/admin/employees']);
      },
      error: (err) => {
        console.error('Error actualizando empleado', err);
        alert('Error al actualizar empleado: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/employees']);
  }
}