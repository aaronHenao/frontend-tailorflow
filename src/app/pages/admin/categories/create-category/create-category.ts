import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; 
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss'
})
export class CreateCategory implements OnInit {
  createForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoriesService: CategoriesService
  ) {
    this.initForm();
  }

  ngOnInit(): void { }

  initForm(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const categoryData = this.createForm.value;

    this.categoriesService.create(categoryData).subscribe({
      next: () => {
        alert('Categoría creada exitosamente');
        this.router.navigate(['/admin/categories']); 
      },
      error: (err) => {
        console.error('Error creando categoría', err);
        alert('Error al crear categoría: ' + (err.error?.message || 'Error de conexión')); 
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']); 
  }
}