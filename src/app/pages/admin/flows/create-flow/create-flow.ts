import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlowsService } from '../../../../services/flows.service';
import { CategoriesService } from '../../../../services/categories.service';
import { RolesService } from '../../../../services/roles.service';
import { Category } from '../../../../core/models/category.model';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-create-flow',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './create-flow.html',
  styleUrl: './create-flow.scss'
})
export class CreateFlow implements OnInit {
  flowForm: FormGroup;
  isLoading = true; 
  isSaving = false;
  categories: Category[] = [];
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flowsService: FlowsService,
    private categoriesService: CategoriesService,
    private rolesService: RolesService
  ) {
    this.flowForm = this.fb.group({
      id_category: [null, Validators.required],
      id_role: [null, Validators.required],
      sequence: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRoles();
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => {
        alert('Error al cargar la lista de categorías. No se puede crear el flujo.');
        this.router.navigate(['/admin/flows']);
      }
    });
  }

  loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        alert('Error al cargar la lista de roles. No se puede crear el flujo.');
        this.router.navigate(['/admin/flows']);
      }
    });
  }

  onSubmit(): void {
    if (!this.flowForm.valid) {
      this.flowForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.flowsService.create(this.flowForm.value).subscribe({
      next: (response) => {
        alert('Flujo creado exitosamente');
        this.router.navigate(['/admin/flows']);
      },
      error: (err) => {
        console.error('Error creando flujo', err);
        alert('Error al crear flujo: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/flows']);
  }
}