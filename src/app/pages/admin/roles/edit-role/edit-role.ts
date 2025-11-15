import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { RolesService } from '../../../../services/roles.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './edit-role.html',
  styleUrl: './edit-role.scss'
})
export class EditRole implements OnInit {
  editForm!: FormGroup;
  roleId!: number;
  role!: Role;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.params['id'];
    this.loadRole();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      areaName: [{ value: '', disabled: true }], 
      name: ['', [Validators.required, Validators.maxLength(50)]], 
      description: ['', [Validators.required, Validators.maxLength(100)]] 
    });
  }

  loadRole(): void {
    this.rolesService.getById(this.roleId).subscribe({
      next: (response) => {
        this.role = response.data;

        this.editForm.patchValue({
          areaName: this.role.area?.name || 'N/A', 
          name: this.role.name,
          description: this.role.description
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando rol', err);
        alert('Error al cargar el rol');
        this.router.navigate(['/admin/roles']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const { name, description } = this.editForm.value;

    const updateData: any = {
      name: name,
      description: description

    };

    this.rolesService.update(this.roleId, updateData).subscribe({
      next: () => {
        alert('Rol actualizado exitosamente');
        this.router.navigate(['/admin/roles']);
      },
      error: (err) => {
        console.error('Error actualizando rol', err);
        alert('Error al actualizar rol: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/roles']);
  }
}