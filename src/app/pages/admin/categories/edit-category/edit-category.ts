import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss'
})
export class EditCategory implements OnInit {
  editForm!: FormGroup;
  categoryId!: number;
  category!: Category;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.params['id']; 
    this.loadCategory();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  loadCategory(): void {
    this.categoriesService.getById(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.data;

        this.editForm.patchValue({
          name: this.category.name,
          description: this.category.description
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categoría', err);
        alert('Error al cargar la categoría para edición: ' + (err.error?.message || 'Error de conexión'));
        this.router.navigate(['/admin/categories']); 
      }
    });
  }


  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updateData: Category = this.editForm.value; 

    this.categoriesService.update(this.categoryId, updateData).subscribe({
      next: () => {
        alert(`Categoría "${updateData.name}" actualizada exitosamente`);
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error actualizando categoría', err);
        alert('Error al actualizar categoría: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}