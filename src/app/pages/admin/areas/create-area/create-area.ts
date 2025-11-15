import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AreasService } from '../../../../services/areas.service';

@Component({
  selector: 'app-create-area',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './create-area.html',
  styleUrl: './create-area.scss'
})
export class CreateArea implements OnInit {
  createForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private areasService: AreasService
  ) {
    this.initForm();
  }

  ngOnInit(): void { }

  initForm(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]] 
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const areaData = this.createForm.value;

    this.areasService.create(areaData).subscribe({
      next: () => {
        alert('Área creada exitosamente');
        this.router.navigate(['/admin/areas']); 
      },
      error: (err) => {
        console.error('Error creando área', err);
        alert('Error al crear área: ' + (err.error?.message || 'Error de conexión')); 
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/areas']); 
  }
}