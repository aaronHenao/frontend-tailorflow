import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AreasService } from '../../../../services/areas.service';
import { Area } from '../../../../core/models/area.model';

@Component({
  selector: 'app-edit-area',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './edit-area.html',
  styleUrl: './edit-area.scss'
})
export class EditArea implements OnInit {
  editForm!: FormGroup;
  areaId!: number;
  area!: Area;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private areasService: AreasService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.areaId = +this.route.snapshot.params['id']; 
    this.loadArea();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]] 
    });
  }

 
  loadArea(): void {
    this.areasService.getById(this.areaId).subscribe({
      next: (response) => {
        this.area = response.data;

        this.editForm.patchValue({
          name: this.area.name
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando área', err);
        alert('Error al cargar el área para edición: ' + (err.error?.message || 'Error de conexión'));
        this.router.navigate(['/admin/areas']); 
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updateData = this.editForm.value;

    this.areasService.update(this.areaId, updateData).subscribe({
      next: () => {
        alert(`Área "${updateData.name}" actualizada exitosamente`);
        this.router.navigate(['/admin/areas']);
      },
      error: (err) => {
        console.error('Error actualizando área', err);
        alert('Error al actualizar área: ' + (err.error?.message || err.message));
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/areas']);
  }
}